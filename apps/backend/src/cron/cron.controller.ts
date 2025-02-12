import {
  Controller,
  Put,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Put('update-time')
  async updateCronTime(
    @Body('cronName') cronName: string,
    @Body('cronTime') cronTime: string,
    @Body('startTime') startTime: Date
  ) {
    try {
      await this.cronService.startCronJob(cronName, cronTime, startTime);
      return { success: true, message: 'Cron time updated successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to update cron time',
        HttpStatus.BAD_REQUEST
      );
    }
  }
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
