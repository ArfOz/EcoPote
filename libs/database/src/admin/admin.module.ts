import { Module } from '@nestjs/common';
import { AdminDatabaseService } from './admin.service';

@Module({
  providers: [AdminDatabaseService],
  exports: [AdminDatabaseService],
})
export class AdminDatabaseModule {}
