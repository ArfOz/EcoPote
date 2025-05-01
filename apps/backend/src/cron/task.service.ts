// import { CronDatabaseService, UserDatabaseService } from '@database';
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as cron from 'node-cron';
// import { ScheduleEnum, CronTimeSetEnum } from '@shared/dtos';
// import { CronService } from './cron.service';

// @Injectable()
// export class TaskService implements OnModuleInit {
//   constructor(
//     private readonly cronDatabaseService: CronDatabaseService,
//     private readonly userDatabaseService: UserDatabaseService,
//     private readonly cronService: CronService
//   ) {}

//   async onModuleInit() {
//     try {
//       // Fetch the cron schedule time from the database
//       await this.cronService.restartCronJobs();
//       const cronTime = await this.cronDatabaseService.findManyCron();

//       if (cronTime.length === 0) {
//         throw new Error('No cron schedules found in the database.');
//       }

//       // Log the fetched schedule value
//       console.log(
//         'Fetched schedule value from database:',
//         cronTime[0].schedule,
//         cronTime[0].startTime
//       );

//       // Map the fetched schedule value to the corresponding enum key
//       const scheduleEnumValue = Object.keys(ScheduleEnum).find(
//         (key) =>
//           ScheduleEnum[key as keyof typeof ScheduleEnum] ===
//           cronTime[0].schedule
//       ) as keyof typeof ScheduleEnum;

//       if (!scheduleEnumValue) {
//         throw new Error(`Invalid schedule value: ${cronTime[0].schedule}`);
//       }

//       // Log the schedule enum value
//       console.log('Schedule enum value:', scheduleEnumValue);

//       // Map the enum value to the cron expression
//       const crontimeset = CronTimeSetEnum[scheduleEnumValue];

//       // Log the mapped cron expression
//       console.log('Mapped cron expression:', crontimeset);

//       // Calculate the delay until the start time
//       const startTime = new Date(cronTime[0].startTime).getTime();
//       const now = Date.now();
//       const delay = startTime - now;

//       if (delay <= 0) {
//         throw new Error('Start time must be in the future.');
//       }

//       // Schedule the task to start at the specified time
//       setTimeout(() => {
//         // Schedule the cron job based on the cron expression
//         cron.schedule(
//           crontimeset, // Use crontimeset instead of cronTime[0].schedule
//           async () => {
//             console.log(
//               'Running scheduled cron job: Fetching data from backend...'
//             );
//             // Add your logic to fetch data from backend here
//           },
//           {
//             scheduled: true,
//             timezone: 'America/New_York', // Change timezone as needed
//           }
//         );

//         console.log(`✅ Cron job scheduled with expression: ${crontimeset}`);
//       }, delay);

//       console.log(
//         `✅ Cron job will start at: ${new Date(startTime).toLocaleString()}`
//       );
//     } catch (error) {
//       console.error('Error scheduling cron job:', error.message);
//     }
//   }
// }
