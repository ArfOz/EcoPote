import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { TaskService } from './task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [CronController],
  providers: [CronService, TaskService],
})
export class CronModule {}
