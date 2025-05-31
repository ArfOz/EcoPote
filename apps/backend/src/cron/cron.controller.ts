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
  CronTimeSetEnum,
  ResponseMessageNews,
} from '@shared/dtos';
import { ScheduleFrontEnum } from '@shared'; // Adjust the import path as needed
import { AuthMode, JwtAuthGuard } from '@auth';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @UseGuards(JwtAuthGuard)
  @AuthMode('static')
  @Get('status')
  async getStatus(@Body() body: { schedule: string }): Promise<string> {
    return this.cronService.getStatus({ schedule: body.schedule });
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-job')
  async createCronJobs(
    @Body() cronData: CronCreateDto
  ): Promise<ResponseCreateCron> {
    try {
      const res = await this.cronService.createCronJob(
        cronData.name,
        cronData.startTime,
        cronData.schedule as unknown as keyof typeof CronTimeSetEnum,
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('update-job')
  async updateCronJob(
    @Body() cronData: CronUpdateDto
  ): Promise<ResponseCronUpdateDto> {
    try {
      console.log('Updating cron job with data:', cronData);
      const response = await this.cronService.updateCronJob(
        cronData.id,
        cronData?.name,
        cronData?.startTime,
        cronData?.schedule,
        cronData?.status
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

  @UseGuards(JwtAuthGuard)
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

  @AuthMode('static')
  @UseGuards(JwtAuthGuard)
  @Get('automatednews')
  async automatedNews(): Promise<ResponseMessageNews> {
    return await this.cronService.automatedNews();
  }
}
