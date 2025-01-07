import { UserDatabaseModule } from './user/user.module';
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AdminDatabaseModule } from './admin';

@Global()
@Module({
  imports: [UserDatabaseModule, AdminDatabaseModule],
  providers: [PrismaService],
  exports: [PrismaService, UserDatabaseModule, AdminDatabaseModule],
})
export class DatabaseModule {}
