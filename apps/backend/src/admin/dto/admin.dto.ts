import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  username?: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class LoginAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  html: string;
}
