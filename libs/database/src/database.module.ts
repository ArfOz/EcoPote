import { News } from '@prisma/client';
import { UserDatabaseModule } from './user/user-database.module';
import { Global, Module } from '@nestjs/common';

import { AdminDatabaseModule } from './admin';
import { PrismaModule } from './prisma/prisma.module';
import { CronDatabaseModule } from './cron';
import { NewsDatabaseModule } from './news';

@Global()
@Module({
  imports: [
    UserDatabaseModule,
    AdminDatabaseModule,
    PrismaModule,
    CronDatabaseModule,
    NewsDatabaseModule,
  ],
  providers: [PrismaModule],
  exports: [
    UserDatabaseModule,
    AdminDatabaseModule,
    PrismaModule,
    CronDatabaseModule,
    NewsDatabaseModule,
  ],
})
export class DatabaseModule {}
