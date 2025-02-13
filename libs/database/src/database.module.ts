import { UserDatabaseModule } from './user/user-database.module';
import { Global, Module } from '@nestjs/common';

import { AdminDatabaseModule } from './admin';
import { PrismaModule } from './prisma/prisma.module';
import { CronDatabaseModule } from './cron';

@Global()
@Module({
  imports: [
    UserDatabaseModule,
    AdminDatabaseModule,
    PrismaModule,
    CronDatabaseModule,
  ],
  providers: [PrismaModule],
  exports: [
    UserDatabaseModule,
    AdminDatabaseModule,
    PrismaModule,
    CronDatabaseModule,
  ],
})
export class DatabaseModule {}
