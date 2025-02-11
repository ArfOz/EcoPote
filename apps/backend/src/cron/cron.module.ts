import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from '../admin/admin.module';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot(), AdminModule],
  providers: [CronService],
})
export class CronModule {}
