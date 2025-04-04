import { User } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
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
    cronTime: string;
    startTime: Date;
    schedule: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    lastRun: Date;
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
}
export enum CronTimeSetEnum {
  EVERY_WEEK = '0 0 * * 0',
  EVERY_DAY = '0 0 * * *',
  EVERY_MONTH = '0 0 1 * *',
  EVERY_YEAR = '0 0 1 1 *',
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
    }[];
  };

  message: string;
  success: boolean;
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
