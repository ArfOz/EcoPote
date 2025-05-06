import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {
  AdminDatabaseModule,
  DatabaseModule,
  UserDatabaseModule,
  UserDatabaseService,
} from '@database'; // Import the module containing UserDatabaseService
import { ConfigModule } from '@nestjs/config';
import generalConfig from '@shared/config/general.config';
import authConfig from '@auth/config/auth.config';
import { AuthModule, AuthService } from '@auth';
import { LogsDatabaseService } from '@database/logs';
import { WinstonLoggerService } from '@logger-winston';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Specify the destination for file uploads
    }),
    ConfigModule.forFeature(generalConfig),
    ConfigModule.forFeature(authConfig),
    UserDatabaseModule,
    DatabaseModule,
    AdminDatabaseModule,
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    UserDatabaseService,
    AdminDatabaseModule,
    WinstonLoggerService,
  ],
})
export class AdminModule {}
