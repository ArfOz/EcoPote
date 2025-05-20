import {
  Controller,
  Body,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CronService } from './cron.service';
import { CronUpdateDto } from './dto';
import {
  ResponseCreateCron,
  ResponseCron,
  ResponseCronUpdateDto,
  CronCreateDto,
  ResponseDeleteCron,
  ResponseCronSendNewsDto,
} from '@shared/dtos';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post('create-job')
  async createCronJobs(
    @Body() cronData: CronCreateDto
  ): Promise<ResponseCreateCron> {
    try {
      const res = await this.cronService.createCronJob(
        cronData.name,
        cronData.startTime,
        cronData.schedule,
        cronData.status
      );
      return res;
    } catch (error) {
      console.error('Error starting cron job:', error);
      throw new HttpException(
        'Failed to start cron job',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('get-jobs')
  async getCronJobs(): Promise<ResponseCron> {
    try {
      const jobs = await this.cronService.getCronJobs();
      return { success: true, data: jobs };
    } catch (error) {
      console.error('Error fetching cron jobs:', error);
      throw new HttpException(
        'Failed to fetch cron jobs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('update-job')
  async updateCronJob(
    @Body() cronData: CronUpdateDto
  ): Promise<ResponseCronUpdateDto> {
    try {
      const response = await this.cronService.updateCronJob(
        cronData.id,
        cronData.name,
        cronData.startTime,
        cronData.schedule,
        cronData.status
      );
      return response;
    } catch (error) {
      console.error('Error updating cron job:', error);
      throw new HttpException(
        'Failed to update cron job',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('delete-job/:id')
  async deleteCronJob(@Param('id') id: string): Promise<ResponseDeleteCron> {
    try {
      return await this.cronService.deleteCronJob(id);
    } catch (error) {
      throw new HttpException(
        'Failed to stop cron job',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
