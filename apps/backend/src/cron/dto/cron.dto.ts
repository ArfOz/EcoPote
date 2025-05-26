import { CronTimeSetEnum, ScheduleFrontEnum } from '@shared/dtos';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';

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
  @IsString()
  schedule?: typeof CronTimeSetEnum;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CronStopDto {
  @IsString()
  @IsNotEmpty()
  cronName: string;
}
