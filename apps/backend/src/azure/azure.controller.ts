import { Controller, Get } from '@nestjs/common';

@Controller('azure')
export class AzureController {
  @Get()
  getAzureStatus(): string {
    return 'Azure service is running!';
  }
}
