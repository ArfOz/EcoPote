import {
  Controller,
  Put,
  Body,
  HttpException,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { CronService } from './cron.service';
import { CronStartDto, CronUpdateDto } from './dto';
import { ResponseCron, ResponseCronUpdateDto } from '@shared/dtos';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post('create-job')
  async createCronJobs(@Body() cronData: CronStartDto) {
    try {
      await this.cronService.saveDatabase(
        cronData.name,
        cronData.startTime,
        cronData.cronTime,
        cronData.schedule
      );
      return { success: true, message: 'Cron job started successfully' };
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
        cronData.cronTime,
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

  @Post('delete-job')
  async deleteCronJob(@Body('cronName') cronName: string) {
    try {
      await this.cronService.deleteCronJob(cronName);
      return { success: true, message: 'Cron job stopped successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to stop cron job',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('restart')
  async restartCronJobs() {
    try {
      await this.cronService.restartCronJobs();
      return { success: true, message: 'Cron jobs restarted successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to restart cron jobs',
        HttpStatus.BAD_REQUEST
      );
    }
  }

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
