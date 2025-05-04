import { Module } from '@nestjs/common';
import { LogsDatabaseService } from './logs-database.service';
import { PrismaService } from '../prisma';

@Module({
  providers: [LogsDatabaseService, PrismaService],
  exports: [LogsDatabaseService],
})
export class LogsDatabaseModule {}
