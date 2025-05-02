import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from './email/email.module';
// import { AzureModule } from './azure/azure.module';
import { ConfigModule } from '@nestjs/config';
import generalConfig from '@shared/config/general.config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '@database';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from '@auth';
import authConfig from '@auth/config/auth.config';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';

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
    // AzureModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
