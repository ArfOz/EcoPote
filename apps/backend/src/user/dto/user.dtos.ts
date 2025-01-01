import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail(
    {},
    { message: 'The email field must contain a valid email address.' }
  )
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  subscripton?: boolean;
}
