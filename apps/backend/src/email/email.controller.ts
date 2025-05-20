import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';

import { Admin } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Multer } from 'multer';
import { AuthMode, JwtAuthGuard } from '@auth';
import { EmailService } from './email.service';
import {
  ResponseEmailOrderDto,
  ResponseEmailsAllDto,
  ResponseMessageEmail,
} from '@shared/dtos';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @AuthMode('static')
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getStatus(): Promise<string> {
    return this.emailService.getStatus();
  }

  @UseGuards(JwtAuthGuard)
  @Post('sendemail')
  @UseInterceptors(FileInterceptor('file'))
  async sendEmail(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { subject: string }
  ): Promise<ResponseMessageEmail> {
    if (!file) {
      throw new Error('File not provided');
    }
    const htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly

    return await this.emailService.sendEmail({
      to: 'all',
      subject: body.subject,
      html: htmlContent,
    });
  }

  @AuthMode('static')
  @UseGuards(JwtAuthGuard)
  @Post('automatedemail')
  async automatedEmail() {
    return await this.emailService.automatedEmail();
  }

  @UseGuards(JwtAuthGuard)
  @Get('emailsorder')
  async getEmailsOrder(): Promise<ResponseEmailOrderDto> {
    return await this.emailService.getEmailsOrder();
  }

  @UseGuards(JwtAuthGuard)
  @Get('allemails')
  async allEmails(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('order') order?: string,
    @Query('status') status?: boolean
  ): Promise<ResponseEmailsAllDto> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    console.log('status', status);
    return await this.emailService.allEmails(
      pageNumber,
      limitNumber,
      order,
      status
    );
  }
}
