import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { AuthModule } from '@auth';
// import { TaskService } from './task.service';

@Module({
  imports: [AuthModule],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}
