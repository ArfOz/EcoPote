import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
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
import { AuthModule, AuthService } from '@auth';

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
  providers: [AdminService, UserDatabaseService, AdminDatabaseModule],
})
export class AdminModule {}
