import { Module } from '@nestjs/common';
import { UserDatabaseService } from './user.service';

@Module({
  providers: [UserDatabaseService],
  exports: [UserDatabaseService],
})
export class UserDatabaseModule {}
