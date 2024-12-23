import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDatabaseService } from '@database';

@Module({
  imports: [UserModule],
  controllers: [UserController],
  providers: [UserService, UserDatabaseService],
})
export class UserModule {}
