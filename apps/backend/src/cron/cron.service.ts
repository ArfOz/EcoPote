import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronStartDto } from './dto';
import { CronDatabaseService, UserDatabaseService } from '@database';
import { sendEmailAzure } from '@shared/nodemailer';
import { Prisma, User } from '@prisma/client';
import * as cron from 'node-cron';

@Injectable()
export class CronService implements OnModuleInit {
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(
    private readonly cronDatabaseService: CronDatabaseService,
    private readonly userDatabaseService: UserDatabaseService
  ) {}

  onModuleInit() {
    // Schedule your cron jobs here
    const emailData = {
      subject: 'Scheduled Email',
      html: '<p>This is a scheduled email.</p>',
    };

    const date = new Date(); // Specific date and time
  }

  async saveDatabase(
    name: string,
    startTime: Date,
    cronTime: string,
    schedule: string
  ) {
    const dateNow = new Date();

    // Parse the startTime to a Date object
    const startDateTime = new Date(startTime);

    // Check if startTime is at least one hour after dateNow
    const oneHourInMillis = 60 * 60 * 1000;
    if (startDateTime.getTime() - dateNow.getTime() < oneHourInMillis) {
      throw new Error(
        'Start time must be at least one hour after the current time.'
      );
    }

    const savedCron: Prisma.CronCreateInput = {
      name,
      cronTime,
      schedule,
      startTime: startDateTime,
      createdAt: dateNow,
      updatedAt: dateNow,
    };

    await this.cronDatabaseService.createCron(savedCron).catch((error) => {
      console.error('Error saving to database:', error);
    });

    return { success: true, message: 'Cron job started successfully' };
  }

  async getCronJobs() {
    const cronJobs = await this.cronDatabaseService.findManyCron();
    return cronJobs;
  }

  async updateCronJob(
    id: number,
    cronName: string,
    startTime: Date,
    cronTime: string,
    schedule: string,
    status: boolean
  ) {
    const dateNow = new Date();

    // Parse the startTime to a Date object
    const startDateTime = new Date(startTime);

    // Check if startTime is at least one hour after dateNow
    const oneHourInMillis = 60 * 60 * 1000;
    if (startDateTime.getTime() - dateNow.getTime() < oneHourInMillis) {
      throw new Error(
        'Start time must be at least one hour after the current time.'
      );
    }

    const updatedCron: Prisma.CronUpdateInput = {
      name: cronName,
      cronTime,
      schedule,
      startTime: startDateTime,
      createdAt: dateNow,
      updatedAt: dateNow,
      status,
    };

    const where: Prisma.CronWhereUniqueInput = { id };
    const data: Prisma.CronUpdateInput = updatedCron;

    await this.cronDatabaseService
      .updateCron({ where, data })
      .catch((error) => {
        console.error('Error updating database:', error);
      });

    return { success: true, message: 'Cron job updated successfully' };
  }

  async deleteCronJob(cronName: string) {
    const job = this.cronJobs.get(cronName);
    if (job) {
      job.stop();
      this.cronJobs.delete(cronName);
      console.log(`Cron job ${cronName} stopped`);
    } else {
      console.error(`Cron job ${cronName} not found`);
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
}
