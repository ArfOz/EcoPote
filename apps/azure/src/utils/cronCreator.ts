import { CronTimeSetEnum } from '../dtos';

export function getCronExpression(
  schedule: keyof typeof CronTimeSetEnum,
  startTime: Date
): string {
  switch (schedule) {
    case 'every-day':
      // Run every day at the hour/minute of startTime
      return `${startTime.getMinutes()} ${startTime.getHours()} * * *`;
    case 'every-week':
      // Run every week at the hour/minute/day of week of startTime
      return `${startTime.getMinutes()} ${startTime.getHours()} * * ${startTime.getDay()}`;
    case 'every-month':
      // Run every month at the hour/minute/day of month of startTime
      return `${startTime.getMinutes()} ${startTime.getHours()} ${startTime.getDate()} * *`;
    case 'every-year':
      // Run every year at the hour/minute/day/month of startTime
      return `${startTime.getMinutes()} ${startTime.getHours()} ${startTime.getDate()} ${
        startTime.getMonth() + 1
      } *`;
    case 'every-5-minutes':
    case 'every-10-minutes':
    case 'every-minute':
      // Use the cron string from the enum directly
      return schedule;
    default:
      throw new Error(`Unsupported schedule key: ${schedule}`);
  }
}
