import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

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
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.adminService.removeUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.adminService.listUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('send-email')
  async sendEmail(
    @Body() emailData: { to: string; subject: string; html: string }
  ): Promise<void> {
    await this.adminService.sendEmail(emailData);
  }
}
