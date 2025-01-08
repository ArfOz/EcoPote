import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {
  AdminDatabaseModule,
  DatabaseModule,
  PrismaModule,
  UserDatabaseModule,
  UserDatabaseService,
} from '@database'; // Import the module containing UserDatabaseService
import { ConfigModule } from '@nestjs/config';
import generalConfig from '@shared/config/general.config';
import authConfig from '@shared/config/auth.config';

@Module({
  imports: [
    ConfigModule.forFeature(generalConfig),
    ConfigModule.forFeature(authConfig),
    UserDatabaseModule,
    DatabaseModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, UserDatabaseService],
})
export class AdminModule {}
