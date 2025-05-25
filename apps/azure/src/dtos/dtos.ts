export enum CronTimeSetEnum {
  'every_week' = '0 0 * * 0',
  'every_day' = '0 0 * * *',
  'every_month' = '0 0 1 * *',
  'every_year' = '0 0 1 1 *',
  // For Testing
  'every_5_minutes' = '*/5 * * * *',
  'every_10_minutes' = '*/10 * * * *',
  'every_minute' = '*/1 * * * *',
}
