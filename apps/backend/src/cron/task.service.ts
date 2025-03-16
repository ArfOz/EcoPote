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

    // Schedule the email to be sent based on the time fetched from the database
    cron.schedule(
      cronTime.daily, // Assuming cronTime has daily and weekly properties
      async () => {
        console.log('Running daily cron job: Sending scheduled email...');
        // await this.emailService.sendEmail();
      },
      {
        scheduled: true,
        timezone: 'America/New_York', // Change timezone as needed
      }
    );

    cron.schedule(
      cronTime.weekly, // Assuming cronTime has daily and weekly properties
      async () => {
        console.log('Running weekly cron job: Sending scheduled email...');
        // await this.emailService.sendEmail();
      },
      {
        scheduled: true,
        timezone: 'America/New_York', // Change timezone as needed
      }
    );

    console.log(
      `✅ Cron jobs scheduled: Daily at ${cronTime.daily} and weekly at ${cronTime.weekly}.`
    );
  }
}
