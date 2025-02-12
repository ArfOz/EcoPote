import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { ConfigModule } from '@nestjs/config';
import { CronController } from './cron.controller';
import generalConfig from '@shared/config/general.config';
import authConfig from '@auth/config/auth.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forFeature(generalConfig),
    ConfigModule.forFeature(authConfig),
  ],
  providers: [CronService],
  controllers: [CronController],
})
export class CronModule {}
