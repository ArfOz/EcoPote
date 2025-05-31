import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  status?: 'true' | 'false';
}

export class CreateAddNewsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  tipsId: string;

  @IsOptional()
  @IsString()
  status: 'true' | 'false';
}
