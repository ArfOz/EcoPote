import { CronDatabaseService, UserDatabaseService } from '@database';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';

@Injectable()
export class TaskService implements OnModuleInit {
  constructor(
    private readonly cronDatabaseService: CronDatabaseService,
    private readonly userDatabaseService: UserDatabaseService
  ) {}

  async onModuleInit() {
    // Fetch the cron schedule time from the database
    const cronTime = await this.cronDatabaseService.findManyCron();

    // Schedule the email to be sent daily at 00:00
    cron.schedule(
      '0 0 * * *', // Daily at midnight
      async () => {
        console.log('Running daily cron job: Sending scheduled email...');
        // await this.emailService.sendEmail();
      },
      {
        scheduled: true,
        timezone: 'America/New_York', // Change timezone as needed
      }
    );

    // Schedule the email to be sent weekly on Sunday at 00:00
    cron.schedule(
      '0 0 * * 0', // Weekly on Sunday at midnight
      async () => {
        console.log('Running weekly cron job: Sending scheduled email...');
        // await this.emailService.sendEmail();
      },
      {
        scheduled: true,
        timezone: 'America/New_York', // Change timezone as needed
      }
    );

    console.log('✅ Cron jobs scheduled: Daily at 00:00 and weekly on Sunday at 00:00.');
  }
}
