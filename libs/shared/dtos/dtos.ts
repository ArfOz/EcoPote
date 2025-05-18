import { News, User } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
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

export interface ResponseMessageEmail {
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
}

export interface ResponseCronUpdateDto {
  success: boolean;
  message: string;
  data: {
    name: string;
    id: number;
    cronTime: string;
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

export enum ScheduleEnum {
  EVERY_WEEK = 'every-week',
  EVERY_MONTH = 'every-month',
  EVERY_DAY = 'every-day',
  EVERY_YEAR = 'every-year',
  // For Testing
  EVERY_5_MINUTES = 'every-5-minutes',
  EVERY_10_MINUTES = 'every-10-minutes',
  EVERY_MINUTE = 'every-minute',
}

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
    cronTime: string;
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
  @IsEnum(ScheduleEnum)
  schedule!: ScheduleEnum;

  @IsBoolean()
  @IsNotEmpty()
  status!: boolean;
}

export interface ResponseDeleteCron {
  message: string;
  success: boolean;
}
export interface ResponseCronSendEmailDto {
  message: string;
  success: boolean;
}

export interface NewsOrder extends News {
  tips: { title: string };
}

export interface ResponseEmailOrderDto {
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

export interface ResponseEmailsAllDto {
  data: { emails: News[]; total: number };
  success: boolean;
  message: string;
}
