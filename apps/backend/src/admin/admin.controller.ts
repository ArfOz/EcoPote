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
import { Multer } from 'multer';
import { AdminService } from './admin.service';
import { Admin, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { JwtAuthGuard } from '@auth';
import { CreateAdminDto, CreateUserDataDto, ResponseMessageEmail } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  async createAdmin(@Body() createAdminData: CreateAdminDto): Promise<Admin> {
    return this.adminService.addAdmin(createAdminData);
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string }
  ): Promise<{ token: string }> {
    return this.adminService.login(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @Headers('Authorization') token: string
  ): Promise<{ message: string; Success: boolean }> {
    return this.adminService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-user')
  async createUser(
    @Body() userData: CreateUserDataDto
  ): Promise<{ message: string; Success: boolean }> {
    return this.adminService.addUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: number): Promise<User> {
    return this.adminService.removeUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ): Promise<{ users: User[]; total: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.adminService.listUsers(pageNumber, limitNumber);
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

    return await this.adminService.sendEmail({
      to: 'all',
      subject: body.subject,
      html: htmlContent,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/:id/toggle-subscription')
  async toggleSubscription(@Param('id') id: string): Promise<User> {
    return this.adminService.toggleSubscription(parseInt(id, 10));
  }
}
