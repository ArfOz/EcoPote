export enum CronTimeSetEnum {
  'every-week' = '0 0 * * 0',
  'every-day' = '0 0 * * *',
  'every-month' = '0 0 1 * *',
  'every-year' = '0 0 1 1 *',
  // For Testing
  'every-5-minutes' = '*/5 * * * *',
  'every-10-minutes' = '*/10 * * * *',
  'every-minute' = '*/1 * * * *',
}
