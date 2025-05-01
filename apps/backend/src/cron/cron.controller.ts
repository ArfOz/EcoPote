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
  ResponseCronSendEmailDto,
} from '@shared/dtos';

import { STATIC_TOKEN_REQUIRED, StaticTokenRequired } from '@shared';
import { AuthMode, JwtAuthGuard } from '@auth';

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
  @UseGuards(JwtAuthGuard)
  @AuthMode('static')
  @Get('send-email')
  async sendEmail() {
    return 'arif';
    // try {
    //   console.log('Sending email...');
    //   const response = await this.cronService.sendEmail();
    //   if (!response) {
    //     throw new HttpException(
    //       'Failed to send email',
    //       HttpStatus.INTERNAL_SERVER_ERROR
    //     );
    //   }
    //   return response;
    // } catch (error) {
    //   throw new HttpException(
    //     error.message || 'Failed to send email',
    //     HttpStatus.BAD_REQUEST
    //   );
    // }
  }

  // @Get('restart')
  // async restartCronJobs() {
  //   try {
  //     await this.cronService.restartCronJobs();
  //     return { success: true, message: 'Cron jobs restarted successfully' };
  //   } catch (error) {
  //     throw new HttpException(
  //       'Failed to restart cron jobs',
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }
  // }

  // @Put('update-time')
  // async updateCronTime(
  //   @Body('cronName') cronName: string,
  //   @Body('date') date: Date,
  //   @Body('emailData') emailData: { subject: string; html: string }
  // ) {
  //   try {
  //     await this.cronService.updateCronJob(cronName, date, emailData);
  //     return { success: true, message: 'Cron time updated successfully' };
  //   } catch (error) {
  //     throw new HttpException(
  //       'Failed to update cron time',
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }
  // }
}

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └─ Day of the week (0 - 7) (Sunday is both 0 and 7)
// │    │    │    │    └───── Month (1 - 12)
// │    │    │    └────────── Day of the month (1 - 31)
// │    │    └─────────────── Hour (0 - 23)
// │    └──────────────────── Minute (0 - 59)
// └───────────────────────── Second (0 - 59, optional)
