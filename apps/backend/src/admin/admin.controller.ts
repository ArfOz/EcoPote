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
} from '@nestjs/common';
import { Multer } from 'multer';
import { AdminService } from './admin.service';
import { Admin, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  async createAdmin(
    @Body() adminData: { email: string; password: string }
  ): Promise<Admin> {
    return this.adminService.addAdmin(adminData);
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string }
  ): Promise<{ access_token: string }> {
    return this.adminService.login(credentials);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Body() { id }: { id: number }): Promise<void> {
    return this.adminService.logout(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('users')
  async createUser(
    @Body() userData: { email: string; subscription: boolean }
  ): Promise<User> {
    return this.adminService.addUser(userData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('users/:id')
  async deleteUser(@Param('id') id: number): Promise<User> {
    return this.adminService.removeUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.adminService.listUsers();
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('sendemail')
  @UseInterceptors(FileInterceptor('file'))
  async sendEmail(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { subject: string }
  ): Promise<string> {
    console.log('File:', file); // Log the file to debug
    if (!file) {
      throw new Error('File not provided');
    }
    const htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly

    return await this.adminService.sendEmail({
      to: 'all',
      subject: body.subject,
      html: htmlContent,
    });
  }
}
