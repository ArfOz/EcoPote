import { Module } from '@nestjs/common';
import { TipsDatabaseService } from './tips-database.service';
import { PrismaService } from '../prisma';

@Module({
  providers: [TipsDatabaseService, PrismaService],
  exports: [TipsDatabaseService],
})
export class TipsDatabaseModule {}
