// import { CronTimeSetEnum } from '../dtos';

// export function getCronExpression(
//   schedule: keyof typeof CronTimeSetEnum,
//   startTime: Date
// ): string {
//   switch (schedule) {
//     case 'every_day':
//       // Run every day at the hour/minute of startTime
//       return `${startTime.getMinutes()} ${startTime.getHours()} * * *`;
//     case 'every_week':
//       // Run every week at the hour/minute/day of week of startTime
//       return `${startTime.getMinutes()} ${startTime.getHours()} * * ${startTime.getDay()}`;
//     case 'every_month':
//       // Run every month at the hour/minute/day of month of startTime
//       return `${startTime.getMinutes()} ${startTime.getHours()} ${startTime.getDate()} * *`;
//     case 'every_year':
//       // Run every year at the hour/minute/day/month of startTime
//       return `${startTime.getMinutes()} ${startTime.getHours()} ${startTime.getDate()} ${
//         startTime.getMonth() + 1
//       } *`;
//     case 'every_5_minutes':
//     case 'every_10_minutes':
//     case 'every_minute':
//       // Use the cron string from the enum directly
//       return schedule;
//     default:
//       throw new Error(`Unsupported schedule key: ${schedule}`);
//   }
// }
