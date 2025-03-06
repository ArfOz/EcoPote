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

export class ResponseLogin {
  message!: string;
  success!: boolean;
  data!: { token: string };
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
}
