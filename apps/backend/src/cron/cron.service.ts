import { TimeCalculator } from '@utils';
import { Injectable, Logger } from '@nestjs/common';
import { ScheduleEnum } from '@shared/dtos'; // Adjust the path based on your project structure
import {
  CronDatabaseService,
  NewsDatabaseService,
  UserDatabaseService,
} from '@database';
import { sendEmailAzure } from '@shared/nodemailer';
import { Prisma, User } from '@prisma/client';
import {
  ResponseCreateCron,
  ResponseCronUpdateDto,
  ResponseDeleteCron,
} from '@shared/dtos';

@Injectable()
export class CronService {
  // private readonly logger = new Logger(CronService.name);
  constructor(
    private readonly cronDatabaseService: CronDatabaseService,
    private readonly userDatabaseService: UserDatabaseService,
    private readonly newsDatabaseService: NewsDatabaseService
  ) {}

  async createCronJob(
    name: string,
    startTime: Date,
    schedule: ScheduleEnum,
    status: boolean
  ): Promise<ResponseCreateCron> {
    const dateNow = new Date();

    // Parse the startTime to a Date object
    const startDateTime = startTime ? new Date(startTime) : undefined;

    // Check if startTime is at least one hour after dateNow
    const oneHourInMillis = 60 * 60 * 1000;
    if (startDateTime.getTime() - dateNow.getTime() < oneHourInMillis) {
      throw new Error(
        'Start time must be at least one hour after the current time.'
      );
    }

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
    return cronJobs;
  }

  async updateCronJob(
    id: number,
    cronName?: string,
    startTime?: Date,
    schedule?: ScheduleEnum,
    status?: boolean
  ): Promise<ResponseCronUpdateDto> {
    const dateNow = new Date();

    const data = await this.cronDatabaseService.findUniqueCron({ id });

    // Parse the startTime to a Date object

    const startDateTime = startTime ? new Date(startTime) : data.startTime;

    const oneHourInMillis = 60 * 60 * 1000;
    if (startDateTime.getTime() - dateNow.getTime() < oneHourInMillis) {
      throw new Error(
        'Start time must be at least one hour after the current time.'
      );
    }

    let nextRun: Date | undefined = data.nextRun;
    if (startTime && schedule) {
      nextRun = TimeCalculator(schedule, startDateTime);
    }

    const updatedCron: Prisma.CronUpdateInput = {
      name: cronName,
      schedule,
      startTime: startDateTime,
      updatedAt: dateNow,
      status,
      nextRun,
    };

    const where: Prisma.CronWhereUniqueInput = { id };

    const updatedData = await this.cronDatabaseService
      .updateCron({ where, data: updatedCron })
      .catch((error) => {
        console.error('Error updating database:', error);
        return null;
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
}
