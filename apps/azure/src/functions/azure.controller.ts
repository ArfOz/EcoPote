// src/azure/azure.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AzureService } from './azure.service';

@Controller('azure')
export class AzureController {
  constructor(private readonly azureService: AzureService) {}

  // @Post('update-schedule')
  // async updateSchedule(@Body() body: UpdateScheduleDto) {
  //   await this.azureService.updateAppSetting(body.newSchedule);
  //   return { message: 'TimerSchedule updated successfully' };
  // }
  @Get('test')
  async test() {
    return this.azureService.testFunction();
  }
}
