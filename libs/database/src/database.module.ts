import { UserDatabaseModule } from './user/user-database.module';
import { Global, Module } from '@nestjs/common';

import { AdminDatabaseModule } from './admin';
import { PrismaModule } from './prisma/prisma.module';
import { CronDatabaseModule } from './cron';
import { NewsDatabaseModule } from './news';
import { TipsDatabaseModule } from './tips';
import { LogsDatabaseModule } from './logs';

@Global()
@Module({
  imports: [
    UserDatabaseModule,
    AdminDatabaseModule,
    PrismaModule,
    CronDatabaseModule,
    NewsDatabaseModule,
    TipsDatabaseModule,
    LogsDatabaseModule,
  ],
  providers: [PrismaModule],
  exports: [
    UserDatabaseModule,
    AdminDatabaseModule,
    PrismaModule,
    CronDatabaseModule,
    NewsDatabaseModule,
    TipsDatabaseModule,
    LogsDatabaseModule,
  ],
})
export class DatabaseModule {}
