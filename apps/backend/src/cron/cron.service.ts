import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronStartDto } from './dto';
import { UserDatabaseService } from '@database';
import { sendEmailAzure } from '@shared/nodemailer';
import { User } from '@prisma/client';
import * as cron from 'node-cron';
import {
  Controller,
  Put,
  Body,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

@Injectable()
export class CronService implements OnModuleInit {
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(private readonly userDatabaseService: UserDatabaseService) {}

  onModuleInit() {
    // Schedule your cron jobs here
    const emailData = {
      subject: 'Scheduled Email',
      html: '<p>This is a scheduled email.</p>',
    };

    const date = new Date('2025-03-15T10:00:00Z'); // Specific date and time
    this.scheduleEmail('sendEmailOnSpecificDate', date, emailData);
  }

  async scheduleEmail(
    cronName: string,
    date: Date,
    emailData: { subject: string; html: string }
  ) {
    const cronTime = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
      date.getMonth() + 1
    } *`;

    const job = cron.schedule(
      cronTime,
      async () => {
        console.log(`Cron job ${cronName} started at ${new Date()}`);
        await this.sendScheduledEmails(emailData);
        job.stop(); // Stop the job after it runs
      },
      {
        scheduled: true,
      }
    );

    this.cronJobs.set(cronName, job);
    console.log(`Cron job ${cronName} scheduled to run at ${date}`);
  }

  async stopCronJob(cronName: string) {
    const job = this.cronJobs.get(cronName);
    if (job) {
      job.stop();
      this.cronJobs.delete(cronName);
      console.log(`Cron job ${cronName} stopped`);
    } else {
      console.error(`Cron job ${cronName} not found`);
    }
  }

  async updateCronJob(
    cronName: string,
    date: Date,
    emailData: { subject: string; html: string }
  ) {
    await this.stopCronJob(cronName);
    await this.scheduleEmail(cronName, date, emailData);
    console.log(`Cron job ${cronName} updated to run at ${date}`);
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
}

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post('start-job')
  async startCronJob(@Body() cronData: CronStartDto) {
    try {
      await this.cronService.scheduleEmail(
        cronData.cronName,
        cronData.date,
        cronData.emailData
      );
      return { success: true, message: 'Cron job started successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to start cron job',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('stop-job')
  async stopCronJob(@Body('cronName') cronName: string) {
    try {
      await this.cronService.stopCronJob(cronName);
      return { success: true, message: 'Cron job stopped successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to stop cron job',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put('update-time')
  async updateCronTime(
    @Body('cronName') cronName: string,
    @Body('date') date: Date,
    @Body('emailData') emailData: { subject: string; html: string }
  ) {
    try {
      await this.cronService.updateCronJob(cronName, date, emailData);
      return { success: true, message: 'Cron time updated successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to update cron time',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
