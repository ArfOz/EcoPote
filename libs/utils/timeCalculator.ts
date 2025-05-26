import { CronTimeSetEnum } from '@shared';

export const TimeCalculator = (
  schedule: keyof typeof CronTimeSetEnum,
  startDateTime: Date
) => {
  switch (schedule) {
    case 'every_5_minutes':
      return new Date(startDateTime.getTime() + 5 * 60 * 1000); // Add 5 minutes to the start time
    case 'every_10_minutes':
      return new Date(startDateTime.getTime() + 10 * 60 * 1000); // Add 10 minutes to the start time
    case 'every_minute':
      return new Date(startDateTime.getTime() + 1 * 60 * 1000); // Add 1 minute to the start time
    case 'every_day':
      return new Date(startDateTime.getTime() + 24 * 60 * 60 * 1000); // Add one day to the start time
    case 'every_week':
      return new Date(startDateTime.getTime() + 7 * 24 * 60 * 60 * 1000); // Add one week to the start time
    case 'every_month': {
      const nextMonth = new Date(startDateTime);
      nextMonth.setMonth(nextMonth.getMonth() + 1); // Add one month to the start time
      return nextMonth;
    }
    case 'every_year': {
      const nextYear = new Date(startDateTime);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      return nextYear;
    }
    default:
      throw new Error('Invalid schedule type');
  }
};

/**
 * Generates a cron expression based on schedule key and startTime.
 * For "every-day", "every-week", "every-month", "every-year", uses startTime's hour/minute.
 * For interval-based (every-5-minutes, etc.), uses the enum value directly.
 */
export function getCronExpression(
  schedule: keyof typeof CronTimeSetEnum,
  startTime: Date
): string {
  switch (schedule) {
    case 'every_day':
      // Run every day at the hour/minute of startTime
      return `${startTime.getMinutes()} ${startTime.getHours()} * * *`;
    case 'every_week':
      // Run every week at the hour/minute/day of week of startTime
      return `${startTime.getMinutes()} ${startTime.getHours()} * * ${startTime.getDay()}`;
    case 'every_month':
      // Run every month at the hour/minute/day of month of startTime
      return `${startTime.getMinutes()} ${startTime.getHours()} ${startTime.getDate()} * *`;
    case 'every_year':
      // Run every year at the hour/minute/day/month of startTime
      return `${startTime.getMinutes()} ${startTime.getHours()} ${startTime.getDate()} ${
        startTime.getMonth() + 1
      } *`;
    case 'every_5_minutes':
      return '*/5 * * * *'; // Adjust as needed for your cron library
    case 'every_10_minutes':
      return '*/10 * * * *'; // Adjust as needed for your cron library
    case 'every_minute':
      return '*/1 * * * *'; // Adjust as needed for your cron library

    default:
      throw new Error(`Unsupported schedule key: ${schedule}`);
  }
}
