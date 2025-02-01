import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    { message: 'The email field must contain a valid email address.' }
  )
  email: string;

  @IsNotEmpty({ message: 'The name field cannot be empty.' })
  @IsString({ message: 'The name field must be a string.' })
  name: string;

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

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'Ooops You forgot the ID' })
  email: string;

  @IsBoolean()
  @IsOptional()
  subscription: boolean;
}
