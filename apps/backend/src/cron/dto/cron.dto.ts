import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CronStartDto {
  @IsString()
  @IsNotEmpty()
  cronName: string;

  @IsString()
  @IsNotEmpty()
  cronTime: string;

  @IsString()
  @IsNotEmpty()
  startTime: Date;
}
