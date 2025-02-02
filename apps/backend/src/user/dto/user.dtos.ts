import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
