import { Module } from '@nestjs/common';
import { NewsDatabaseService } from './news-database.service';
import { PrismaService } from '../prisma';

@Module({
  providers: [NewsDatabaseService, PrismaService],
  exports: [NewsDatabaseService],
})
export class NewsDatabaseModule {}
// Compare this snippet from libs/database/src/news/news-database.service.ts:
