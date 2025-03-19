import { News } from '@prisma/client';
import { UserDatabaseModule } from './user/user-database.module';
import { Global, Module } from '@nestjs/common';

import { AdminDatabaseModule } from './admin';
import { PrismaModule } from './prisma/prisma.module';
import { CronDatabaseModule } from './cron';
import { NewsDatabaseModule } from './news';
import { TipsDatabaseModule } from './tips';

@Global()
@Module({
  imports: [
    UserDatabaseModule,
    AdminDatabaseModule,
    PrismaModule,
    CronDatabaseModule,
    NewsDatabaseModule,
    TipsDatabaseModule,
  ],
  providers: [PrismaModule],
  exports: [
    UserDatabaseModule,
    AdminDatabaseModule,
    PrismaModule,
    CronDatabaseModule,
    NewsDatabaseModule,
    TipsDatabaseModule,
  ],
})
export class DatabaseModule {}
