import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import {
  AdminDatabaseModule,
  DatabaseModule,
  UserDatabaseModule,
  UserDatabaseService,
} from '@database'; // Import the module containing UserDatabaseService
import { ConfigModule } from '@nestjs/config';
import generalConfig from '@shared/config/general.config';
import authConfig from '@auth/config/auth.config';
import { AuthModule } from '@auth';

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
  controllers: [TipsController],
  providers: [TipsService, UserDatabaseService, AdminDatabaseModule],
})
export class TipsModule {}
