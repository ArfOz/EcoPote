import { UserDatabaseModule } from './user/user.module';
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  imports: [UserDatabaseModule],
  providers: [PrismaService],
  exports: [PrismaService, UserDatabaseModule],
})
export class DatabaseModule {}
