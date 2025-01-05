import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
