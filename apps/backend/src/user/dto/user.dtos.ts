import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    { message: 'The email field must contain a valid email address.' }
  )
  email: string;

  @IsBoolean()
  @IsOptional()
  subscription: boolean;
}

export class UnregisterUserDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    { message: 'The email field must contain a valid email address.' }
  )
  email: string;

  @IsBoolean()
  @IsOptional()
  subscription: boolean;
}
