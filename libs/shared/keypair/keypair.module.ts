import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { KeypairService } from './keypair.service';
import generalConfig from '../config/general.config';

@Module({
  imports: [ConfigModule.forFeature(generalConfig)],
  providers: [KeypairService],
  exports: [KeypairService],
})
export class KeypairModule {}
