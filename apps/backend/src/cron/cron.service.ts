import { UpdateAdminDto } from './../admin/dto/admin.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { sendBulkEmails, sendEmailAzure } from '@shared/nodemailer';
import { CronTime, CronJob } from 'cron';
import { User } from '@prisma/client';
import { CronDatabaseService, UserDatabaseService } from '@database';

@Injectable()
export class CronService {
  constructor(
    private readonly userDatabaseService: UserDatabaseService,
    private readonly cronDatabaseService: CronDatabaseService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  // @Cron(CronExpression.EVERY_WEEK)
  // async sendWeeklyEmails() {
  //   console.log('Cron job running every week');
  //   await this.sendScheduledEmails();
  // }

  // @Cron(CronExpression.EVERY_MINUTE)
  // async sendEmailsEveryMinute() {
  //   console.log('Cron job running every minute');
  //   await this.sendScheduledEmails();
  // }

  // @Cron(CronExpression.EVERY_6_MONTHS)
  // async sendMonthlyEmails() {
  //   console.log('Cron job running every month');
  //   await this.sendScheduledEmails();
  // }

  async updateCronTime(cronName: string, cronTime: string, startTime: Date) {
    const cronJob = this.schedulerRegistry.getCronJob(cronName);
    if (cronJob) {
      cronJob.setTime(new CronTime(cronTime));
      this.schedulerRegistry.deleteCronJob(cronName);
      this.schedulerRegistry.addCronJob(cronName, cronJob);
      cronJob.start();
      console.log(`Cron job ${cronName} updated to run at ${cronTime}`);
    } else {
      console.error(`Cron job ${cronName} not found`);
    }
  }

  async startCronJob(cronName: string, cronTime: string, startTime: Date) {
    const cronJob = new CronJob(
      cronTime,
      async () => {
        console.log(`Cron job ${cronName} started at ${startTime}`);
        await this.sendScheduledEmails();
      },
      null,
      true,
      undefined,
      null,
      true
    );

    cronJob.start();
    this.schedulerRegistry.addCronJob(cronName, cronJob);
    console.log(`Cron job ${cronName} scheduled to start at ${startTime}`);
  }

  async stopCronJob(cronName: string) {
    const cronJob = this.schedulerRegistry.getCronJob(cronName);
  }

  async updateCronJob(cronName: string, cronTime: string, startTime: Date) {
    const cronJob = this.schedulerRegistry.getCronJob(cronName);
    if (cronJob) {
      cronJob.setTime(new CronTime(cronTime));
      this.schedulerRegistry.deleteCronJob(cronName);
      this.schedulerRegistry.addCronJob(cronName, cronJob);
      cronJob.start();
      console.log(`Cron job ${cronName} updated to run at ${cronTime}`);
    } else {
      console.error(`Cron job ${cronName} not found`);
    }
  }

  private async sendScheduledEmails() {
    try {
      const users: User[] = await this.userDatabaseService.findAll({
        where: { subscription: true },
      });

      if (users.length === 0) {
        throw new HttpException(
          'No users to send email to',
          HttpStatus.NOT_FOUND
        );
      }
      // emaildata will be taken from the database
      const emailData = {
        subject: 'Scheduled Email',
        html: '<p>This is a scheduled email.</p>',
      };

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
