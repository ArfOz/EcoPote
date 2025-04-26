import { ScheduleEnum } from './../shared/dtos/dtos';
export const TimeCalculator = (schedule: ScheduleEnum, startDateTime: Date) => {
  switch (schedule) {
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
