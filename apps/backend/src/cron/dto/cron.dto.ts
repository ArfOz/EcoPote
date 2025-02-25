import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';

export enum ScheduleEnum {
  EVERY_WEEK = 'every-week',
  EVERY_MONTH = 'every-month',
  EVERY_DAY = 'every-day',
  EVERY_YEAR = 'every-year',
}

export class CronStartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cronTime: string;

  @IsString()
  @IsNotEmpty()
  startTime: Date;

  @IsNotEmpty()
  @IsEnum(ScheduleEnum)
  schedule: ScheduleEnum;
}

export class CronUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cronTime: string;

  @IsString()
  @IsNotEmpty()
  startTime: Date;

  @IsNotEmpty()
  @IsEnum(ScheduleEnum)
  schedule: ScheduleEnum;
}

export class CronStopDto {
  @IsString()
  @IsNotEmpty()
  cronName: string;
}
