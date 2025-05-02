// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { AzureService } from './azure.service';

// @Controller('azure')
// export class AzureController {
//   constructor(private readonly azureService: AzureService) {}
//   @Get()
//   getAzureStatus(): string {
//     return 'Azure service is running!';
//   }

//   @Post('update-azure-function')
//   async updateAzureFunction(
//     @Body() body: { functionName: string; code: string }
//   ): Promise<string> {
//     return await this.azureService.updateFunction(body.functionName, body.code);
//   }
// }
