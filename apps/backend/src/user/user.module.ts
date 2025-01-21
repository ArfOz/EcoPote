import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  DatabaseModule,
  UserDatabaseModule,
  UserDatabaseService,
} from '@database';

@Module({
  imports: [UserDatabaseModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserDatabaseService],
})
export class UserModule {}
