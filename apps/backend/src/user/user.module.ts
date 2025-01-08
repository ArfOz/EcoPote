import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  DatabaseModule,
  PrismaModule,
  UserDatabaseModule,
  UserDatabaseService,
} from '@database';
// Import any necessary modules here
// import { SomeOtherModule } from 'path/to/module';

@Module({
  imports: [
    // Add imported modules here
    // SomeOtherModule,
    UserDatabaseModule,
    DatabaseModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserDatabaseService],
})
export class UserModule {}
