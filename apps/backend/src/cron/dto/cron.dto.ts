import { ScheduleEnum } from '@shared/dtos';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';

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
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cronTime?: string;

  @IsString()
  @IsOptional()
  startTime?: Date;

  @IsOptional()
  @IsEnum(ScheduleEnum)
  schedule?: ScheduleEnum;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CronStopDto {
  @IsString()
  @IsNotEmpty()
  cronName: string;
}
