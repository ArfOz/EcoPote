import { UserDatabaseModule } from './user/user-database.module';
import { Global, Module } from '@nestjs/common';

import { AdminDatabaseModule } from './admin';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [UserDatabaseModule, AdminDatabaseModule, PrismaModule],
  providers: [PrismaModule],
  exports: [UserDatabaseModule, AdminDatabaseModule, PrismaModule],
})
export class DatabaseModule {}
