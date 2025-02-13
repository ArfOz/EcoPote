import { Module } from '@nestjs/common';
import { CronDatabaseService } from './cron-database.service';
import { PrismaService } from '../prisma';

@Module({
  providers: [CronDatabaseService, PrismaService],
  exports: [CronDatabaseService],
})
export class CronDatabaseModule {}
