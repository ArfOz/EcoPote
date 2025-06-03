import { News, User } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export interface ResponseGetAllusers {
  message: string;
  success: boolean;
  data: {
    users: User[];
    total: number;
  };
}

export interface ResponseLogout {
  message: string;
  success: boolean;
}

export interface ResponseCreateUser {
  message: string;
  success: boolean;
}

export class CronUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

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
  schedule?: keyof typeof CronTimeSetEnum;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
export interface ResponseMessageNews {
  data: {
    sentUsers: string[];
    errorUsers: string[];
  };
  message: string;
  success: boolean;
}

export interface ResponseToggleSubscription {
  data: User;
  message: string;
  success: boolean;
}

export interface ResponseDeleteUser {
  message: string;
  success: boolean;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    { message: 'The email field must contain a valid email address.' }
  )
  email!: string;

  @IsNotEmpty({ message: 'The name field cannot be empty.' })
  @IsString({ message: 'The name field must be a string.' })
  name!: string;

  @IsBoolean()
  @IsOptional()
  subscription!: boolean;
}

export interface ResponseLogin {
  message: string;
  success: boolean;
  data: { token: string };
}
export interface ResponseCron {
  data: {
    name: string;
    id: number;
    startTime: Date;
    schedule: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    lastRun: Date | null;
    nextRun: Date | null;
  }[];
  success: boolean;
  message: string;
}

export interface ResponseCronUpdateDto {
  success: boolean;
  message: string;
  data: {
    name: string;
    id: number;
    startTime: Date;
    schedule: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    lastRun: Date;
    nextRun: Date | null;
  };
}

export interface Tips {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResponseTips {
  message: string;
  success: boolean;
  data: {
    tips: Tips[];
    total: number;
  };
}

export enum ScheduleFrontEnum {
  'every_week' = 'Every Week',
  'every_month' = 'Every Month',
  'every_day' = 'Every Day',
  'every_year' = 'Every Year',
  // For Testing
  'every_5_minutes' = 'Every 5 Minutes',
  'every_10_minutes' = 'Every 10 Minutes',
  'every_minute' = 'Every Minute',
}

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

export interface ResponseTipsDetails {
  message: string;
  success: boolean;
  data: {
    total: number;
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    news?: {
      id: number;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      status: boolean;
      sendStatus: boolean;
      sendTime: Date | null;
    }[];
  };
}

export interface ResponseDeleteNews {
  data: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
    tipsId: number;
  };
  message: string;
  success: boolean;
}

export interface ResponseTipNews {
  data: {
    total: number;
    news: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      title: string;
      content: string;
      tipsId: number;
      status: boolean;
      sendTime: Date | null;
    }[];
  };

  message: string;
  success: boolean;
}

export interface ResponseUpdateNews {
  message: string;
  success: boolean;
  data: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
    tipsId: number;
    status: boolean;
  };
}

export interface ResponseAddNews {
  message: string;
  success: boolean;
  data: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
    tipsId: number;
  };
}

export interface ResponseCreateCron {
  message: string;
  success: boolean;
  data: {
    name: string;
    id: number;
    startTime: Date;
    schedule: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    lastRun: Date | null;
    nextRun: Date | null;
  };
}

export class CronCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  @IsNotEmpty()
  startTime!: Date;

  @IsNotEmpty()
  @IsEnum(ScheduleFrontEnum)
  schedule!: keyof typeof ScheduleFrontEnum;

  @IsBoolean()
  @IsNotEmpty()
  status!: boolean;
}

export interface ResponseDeleteCron {
  message: string;
  success: boolean;
}
export interface ResponseCronSendNewsDto {
  message: string;
  success: boolean;
}

export interface NewsOrder extends News {
  tips: { title: string };
}

export interface ResponseNewsOrderDto {
  data: NewsOrder[];
  success: boolean;
  message: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface ResponseUnregisterUserDto {
  message: string;
  success: boolean;
  data: {
    id: number;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    subscription: boolean;
  };
}

export interface ResponseNewsAllDto {
  data: { emails: News[]; total: number };
  success: boolean;
  message: string;
}
