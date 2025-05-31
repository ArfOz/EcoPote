import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';
import generalConfig from '@shared/config/general.config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '@database';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from '@auth';
import authConfig from '@auth/config/auth.config';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
// import { WinstonLoggerModule } from '@logger-winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [generalConfig, authConfig],
    }),
    DatabaseModule,
    UserModule,
    AdminModule,
    AuthModule,
    ScheduleModule.forRoot(),
    CronModule,
    NewsModule,
    // WinstonLoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
