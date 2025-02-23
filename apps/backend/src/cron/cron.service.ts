import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronStartDto } from './dto';
import { CronDatabaseService, UserDatabaseService } from '@database';
import { sendEmailAzure } from '@shared/nodemailer';
import { Prisma, User } from '@prisma/client';
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

  constructor(private readonly cronDatabaseService: CronDatabaseService) {}

  onModuleInit() {
    // Schedule your cron jobs here
    const emailData = {
      subject: 'Scheduled Email',
      html: '<p>This is a scheduled email.</p>',
    };

    const date = new Date(); // Specific date and time
  }

  async saveDatabase(name, startTime, cronTime, schedule) {
    const dateNow = new Date();
    const savedCron: Prisma.CronCreateInput = {
      name,
      cronTime,
      schedule: 'test',
      startTime: dateNow,
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

  // async stopCronJob(cronName: string) {
  //   const job = this.cronJobs.get(cronName);
  //   if (job) {
  //     job.stop();
  //     this.cronJobs.delete(cronName);
  //     console.log(`Cron job ${cronName} stopped`);
  //   } else {
  //     console.error(`Cron job ${cronName} not found`);
  //   }
  // }

  // async updateCronJob(
  //   cronName: string,
  //   date: Date,
  //   emailData: { subject: string; html: string }
  // ) {
  //   await this.stopCronJob(cronName);
  //   await this.scheduleEmail(cronName, date, emailData);
  //   console.log(`Cron job ${cronName} updated to run at ${date}`);
  // }

  // private async sendScheduledEmails(emailData: {
  //   subject: string;
  //   html: string;
  // }) {
  //   try {
  //     const users: User[] = await this.userDatabaseService.findAll({
  //       where: { subscription: true },
  //     });

  //     if (users.length === 0) {
  //       throw new Error('No users to send email to');
  //     }

  //     const { sentUsers, errorUsers } = await sendEmailAzure(
  //       users,
  //       emailData.subject,
  //       emailData.html
  //     );

  //     console.log('Scheduled emails sent successfully', sentUsers, errorUsers);
  //   } catch (error) {
  //     console.error('Failed to send scheduled emails', error);
  //   }
  // }
}
