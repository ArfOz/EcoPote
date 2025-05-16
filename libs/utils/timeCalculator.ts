import { ScheduleEnum } from './../shared/dtos/dtos';
export const TimeCalculator = (schedule: ScheduleEnum, startDateTime: Date) => {
  switch (schedule) {
    case 'every-5-minutes':
      return new Date(startDateTime.getTime() + 5 * 60 * 1000); // Add 5 minutes to the start time
    case 'every-10-minutes':
      return new Date(startDateTime.getTime() + 10 * 60 * 1000); // Add 10 minutes to the start time
    case 'every-minute':
      return new Date(startDateTime.getTime() + 1 * 60 * 1000); // Add 1 minute to the start time
    case 'every-day':
      return new Date(startDateTime.getTime() + 24 * 60 * 60 * 1000); // Add one day to the start time
    case 'every-week':
      return new Date(startDateTime.getTime() + 7 * 24 * 60 * 60 * 1000); // Add one week to the start time
    case 'every-month': {
      const nextMonth = new Date(startDateTime);
      nextMonth.setMonth(nextMonth.getMonth() + 1); // Add one month to the start time
      return nextMonth;
    }
    case 'every-year': {
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
  schedule: ScheduleEnum,
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
      return '*/5 * * * *'; // Adjust as needed for your cron library
    case 'every-10-minutes':
      return '*/10 * * * *'; // Adjust as needed for your cron library
    case 'every-minute':
      return '*/1 * * * *'; // Adjust as needed for your cron library

    default:
      throw new Error(`Unsupported schedule key: ${schedule}`);
  }
}
