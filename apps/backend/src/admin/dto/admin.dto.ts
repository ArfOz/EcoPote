import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

export class CreateUserDataDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsBoolean()
  subscription?: boolean;
}
export class UpdateUserDataDto {
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsBoolean()
  subscription?: boolean;
}
