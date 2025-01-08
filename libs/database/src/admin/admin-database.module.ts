import { Module } from '@nestjs/common';
import { AdminDatabaseService } from './admin-database.service';
import { PrismaService } from '../prisma';

@Module({
  providers: [AdminDatabaseService, PrismaService],
  exports: [AdminDatabaseService],
})
export class AdminDatabaseModule {}
