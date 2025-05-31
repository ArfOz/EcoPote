import { getCronExpression, TimeCalculator } from '@utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CronTimeSetEnum } from '@shared/dtos'; // Adjust the path based on your project structure
import {
  CronDatabaseService,
  NewsDatabaseService,
  UserDatabaseService,
} from '@database';
import { sendEmailAzure, sendEmailsGmail } from '@shared/nodemailer';
import { Prisma, User } from '@prisma/client';
import {
  ResponseCreateCron,
  ResponseCronUpdateDto,
  ResponseDeleteCron,
} from '@shared/dtos';
import authConfig from '@auth/config/auth.config';
import { ConfigType } from '@nestjs/config';
import { start } from 'repl';

@Injectable()
export class CronService {
  // private readonly logger = new Logger(CronService.name);
  constructor(
    private readonly cronDatabaseService: CronDatabaseService,
    private readonly userDatabaseService: UserDatabaseService,
    private readonly newsDatabaseService: NewsDatabaseService,
    @Inject(authConfig.KEY)
    private readonly authCfg: ConfigType<typeof authConfig>
  ) {}

  async getStatus({ schedule }: { schedule: string }): Promise<string> {
    console.log(
      'Email service is running!',
      new Date().toISOString(),
      'schedule',
      schedule
    );
    return 'Email service is running!';
  }
  async createCronJob(
    name: string,
    startTime: Date,
    schedule: keyof typeof CronTimeSetEnum,
    status: boolean
  ): Promise<ResponseCreateCron> {
    const dateNow = new Date();

    // Parse the startTime to a Date object
    const startDateTime = startTime ? new Date(startTime) : undefined;

    // // Check if startTime is at least one hour after dateNow
    // const oneHourInMillis = 60 * 60 * 1000;
    // if (startDateTime.getTime() - dateNow.getTime() < oneHourInMillis) {
    //   throw new Error(
    //     'Start time must be at least one hour after the current time.'
    //   );
    // }

    // Convert the schedule (datetime string) to a Date object
    const nextRun = TimeCalculator(schedule, startDateTime);

    const savedCron: Prisma.CronCreateInput = {
      name,
      schedule,
      startTime: startDateTime,
      createdAt: dateNow,
      updatedAt: dateNow,
      status,
      nextRun,
    };

    const res = await this.cronDatabaseService
      .createCron(savedCron)
      .catch((error) => {
        console.error('Error saving to database:', error);
        return null;
      });

    if (!res) {
      throw new Error('Failed to save cron job to the database.');
    }

    // this.logger.log(`Successfully created cron job with ID: ${res.id}`);

    return {
      success: true,
      message: 'Cron job started successfully',
      data: res,
    };
  }

  async getCronJobs() {
    const cronJobs = await this.cronDatabaseService.findManyCron();
    if (!cronJobs || cronJobs.length === 0) {
      throw new HttpException('No cron jobs found', HttpStatus.NOT_FOUND);
    }

    // Map the cron jobs to the desired format

    return cronJobs;
  }

  async updateCronJob(
    id: number,
    cronName?: string,
    startTime?: Date,
    schedule?: keyof typeof CronTimeSetEnum,
    status?: boolean
  ): Promise<ResponseCronUpdateDto> {
    const dateNow = new Date();

    console.log(
      'Updating cron job with ID:',
      id,
      'cronName:',
      cronName,
      'startTime:',
      startTime,
      'schedule:',
      schedule,
      'status:',
      status
    );

    const data = await this.cronDatabaseService.findUniqueCron({ id });

    // Fallback to existing schedule if not provided
    schedule = schedule || data.schedule;

    // Parse the startTime to a Date object
    const startDateTime = startTime ? new Date(startTime) : data.startTime;

    // Only skip update if only the name changed, otherwise proceed and trigger Azure Function.
    if (
      cronName !== undefined &&
      cronName !== data.name &&
      startDateTime.getTime() === new Date(data.startTime).getTime() &&
      schedule === data?.schedule &&
      status === data?.status
    ) {
      const data = await this.cronDatabaseService.updateCron({
        where: { id },
        data: { name: cronName, updatedAt: dateNow },
      });
      return {
        success: true,
        message: 'No changes detected except name, cron job not updated',
        data,
      };
    }

    let nextRun: Date | undefined;
    if (schedule) {
      nextRun = TimeCalculator(schedule, startDateTime);
    }

    console.log(
      'Next run calculated as:',
      nextRun,
      'Start time:',
      startDateTime
    );

    if (startDateTime < nextRun) {
      nextRun = startDateTime;
    }

    const newCron = getCronExpression(schedule, startDateTime);

    const updatedCron: Prisma.CronUpdateInput = {
      name: cronName,
      startTime: startDateTime,
      updatedAt: dateNow,
      status,
      nextRun,
      schedule,
    };

    try {
      await fetch('http://localhost:7071/api/scheduleJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCfg.static_token_cron_trigger}`,
        },
        body: JSON.stringify({
          status,
          newCron,
          startTime,
        }),
      });
    } catch (error) {
      throw new HttpException(
        error instanceof HttpException
          ? error.message
          : 'Failed to call Azure Function: scheduleJob',
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.BAD_GATEWAY
      );
    }
    const updatedData = await this.cronDatabaseService
      .updateCron({ where: { id }, data: updatedCron })
      .catch((error) => {
        console.error('Error updating database:', error);
        throw new HttpException(
          'Failed to update cron job in the database',
          HttpStatus.BAD_REQUEST
        );
      });
    if (!updatedData) {
      throw new Error('Failed to update cron job');
    }

    return {
      success: true,
      message: 'Cron job updated successfully',
      data: updatedData,
    };
  }

  async deleteCronJob(id: string): Promise<ResponseDeleteCron> {
    const idNum = parseInt(id, 10);
    const job = await this.cronDatabaseService.findUniqueCron({ id: idNum });
    if (job) {
      await this.cronDatabaseService.deleteCron({ id: idNum });
      return { success: true, message: 'Cron job stopped successfully' };
    } else {
      return { success: false, message: 'Cron job not found' };
    }
  }

  private async sendScheduledEmails(emailData: {
    subject: string;
    html: string;
  }) {
    try {
      const users: User[] = await this.userDatabaseService.findAll({
        where: { subscription: true },
      });

      if (users.length === 0) {
        throw new Error('No users to send email to');
      }

      const { sentUsers, errorUsers } = await sendEmailAzure(
        users,
        emailData.subject,
        emailData.html
      );

      console.log('Scheduled emails sent successfully', sentUsers, errorUsers);
    } catch (error) {
      console.error('Failed to send scheduled emails', error);
    }
  }

  async sendEmail() {
    const email = await this.newsDatabaseService.findFirst(
      { status: true },
      { createdAt: 'desc' }
    );
    if (!email) {
      throw new Error('No email found to send');
    }
    console.log('email', email);
    const { title, content } = email;
    const users: User[] = await this.userDatabaseService.findAll({
      where: { subscription: true },
    });

    console.log('users', users);
    if (users.length === 0) {
      throw new Error('No users to send email to');
    }
    const { sentUsers, errorUsers } = await sendEmailAzure(
      users,
      title,
      content
    );

    console.log('Scheduled emails sent successfully', sentUsers, errorUsers);
    return {
      success: true,
      message: 'Scheduled emails sent successfully',
      data: { sentUsers, errorUsers },
    };
  }

  // async restartCronJobs() {
  //   try {
  //     const cronJobs = await this.cronDatabaseService.findManyCron();
  //     for (const cronJob of cronJobs) {
  //       const { name, cronTime, startTime, schedule } = cronJob;
  //       const job = cron.schedule(cronTime, () => {
  //         this.sendScheduledEmails({
  //           subject: 'Scheduled Email',
  //           html: '<p>This is a scheduled email.</p>',
  //         });
  //       });

  //       job.start();
  //       this.cronJobs.set(name, job);
  //       console.log(`Cron job ${name} restarted`);
  //     }
  //   } catch (error) {
  //     console.error('Failed to restart cron jobs', error);
  //   }
  // }

  async automatedNews() {
    const users: User[] = await this.userDatabaseService.findAll({
      where: { subscription: true },
    });

    if (users.length === 0) {
      throw new HttpException(
        'No users to send email to',
        HttpStatus.NOT_FOUND
      );
    }

    const email = await this.newsDatabaseService.findFirst({ status: true });

    if (!email) {
      throw new HttpException('No news to send email to', HttpStatus.NOT_FOUND);
    }

    // const { sentUsers, errorUsers } = await sendEmailAzure(
    //   users,
    //   email.title,
    //   email.content
    // );

    const { sentUsers, errorUsers } = await sendEmailsGmail(
      users,
      email.title,
      email.content
    );

    // const { sentUsers, errorUsers } = {
    //   sentUsers: ['asds'],
    //   errorUsers: [],
    // };

    // Remove seconds and milliseconds from sendTime
    const sendTime = new Date();
    sendTime.setSeconds(0, 0);

    const emailUpdate = await this.newsDatabaseService.updateNews(
      email.id,
      { status: false, sendTime } // Update the status to false after sending
    );
    if (!emailUpdate) {
      throw new HttpException(
        'Failed to update email status',
        HttpStatus.BAD_REQUEST
      );
    }

    const cronData = await this.cronDatabaseService.findUniqueCron({
      id: 1,
    });

    let nextRun: Date | undefined;

    const schedule: keyof typeof CronTimeSetEnum | undefined =
      cronData.schedule;

    if (schedule) {
      // If schedule is an array, use the first element as the key
      const now = new Date();
      now.setSeconds(0, 0); // Set seconds and milliseconds to zero
      nextRun = TimeCalculator(schedule, now);
    }

    const updateCronDatabase: Prisma.CronUpdateInput = {
      nextRun,
      lastRun: new Date(),
    };
    console.log('nextRun', nextRun);

    await this.cronDatabaseService.updateCron({
      where: { id: 1 },
      data: updateCronDatabase,
    });

    return {
      data: { sentUsers, errorUsers },
      success: true,
      message: 'Email sent successfully',
    };
  }
  catch(error) {
    // Handle error
    console.error('Error sending email:', error);
    throw new HttpException('Failed to send email', HttpStatus.BAD_REQUEST);
  }
}
