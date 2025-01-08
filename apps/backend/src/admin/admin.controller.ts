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
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import generalConfig from '@shared/config/general.config';
import { ConfigType } from '@nestjs/config';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string }
  ): Promise<{ token: string }> {
    return this.adminService.login(credentials);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Body() { id }: { id: number }): Promise<void> {
    return this.adminService.logout(id);
  }

  @Post('users')
  async createUser(
    @Body() userData: { email: string; subscription: boolean }
  ): Promise<User> {
    return this.adminService.addUser(userData);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.adminService.removeUser(id);
  }

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.adminService.listUsers();
  }
}
