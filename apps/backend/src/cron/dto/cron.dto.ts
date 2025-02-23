import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CronStartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cronTime: string;

  @IsString()
  @IsNotEmpty()
  startTime: Date;

  @IsString()
  @IsNotEmpty()
  schedule: string;
}
