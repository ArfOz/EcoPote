import { Module } from '@nestjs/common';
import { AzureController } from './functions/azure.controller';
import { AzureService } from './functions/azure.service';

@Module({
  imports: [],
  controllers: [AzureController],
  providers: [AzureService],
})
export class AppModule {}
