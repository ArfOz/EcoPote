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
  Headers,
} from '@nestjs/common';

import { Admin } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Multer } from 'multer';
import { JwtAuthGuard } from '@auth';
import { EmailService } from './email.service';
import { ResponseMessageEmail } from '@shared/dtos';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

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

  // @UseGuards(JwtAuthGuard)
  @Post('automatedemail')
  async automatedEmail() {
    return await this.emailService.automatedEmail();
  }
}
