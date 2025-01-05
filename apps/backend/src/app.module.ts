import { Module } from '@nestjs/common';

import generalConfig from '@shared/config/general.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '@database';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [generalConfig],
    }),
    UserModule,
    AdminModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
