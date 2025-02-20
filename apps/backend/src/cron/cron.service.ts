import { Injectable } from '@nestjs/common';
import { CronStartDto } from './dto';
import { UserDatabaseService } from '@database';
import { sendEmailAzure } from '@shared/nodemailer';
import { User } from '@prisma/client';
import * as cron from 'node-cron';

@Injectable()
export class CronService {
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(private readonly userDatabaseService: UserDatabaseService) {}

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
