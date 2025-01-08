import { Module } from '@nestjs/common';
import { UserDatabaseService } from './user-database.service';
import { PrismaService } from '../prisma';

@Module({
  providers: [UserDatabaseService, PrismaService],
  exports: [UserDatabaseService],
})
export class UserDatabaseModule {}
