import { Module } from '@nestjs/common';

import generalConfig from '@shared/config/general.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '@database';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from '@auth';
import authConfig from '@auth/config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [generalConfig, authConfig],
    }),
    DatabaseModule,
    UserModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
