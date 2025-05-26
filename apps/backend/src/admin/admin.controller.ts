import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
  Headers,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from '@prisma/client';

import { JwtAuthGuard } from '@auth';
import { CreateAdminDto } from './dto';
import {
  CreateUserDto,
  ResponseCreateUser,
  ResponseDeleteUser,
  ResponseGetAllusers,
  ResponseLogin,
  ResponseLogout,
  ResponseToggleSubscription,
} from '@shared/dtos';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('test')
  async test(): Promise<string> {
    console.log('Test endpoint hit!', new Date().toISOString());
    return 'Test endpoint is working!';
  }

  @Post('create')
  async createAdmin(@Body() createAdminData: CreateAdminDto): Promise<Admin> {
    return this.adminService.addAdmin(createAdminData);
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string }
  ): Promise<ResponseLogin> {
    return await this.adminService.login(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @Headers('Authorization') token: string
  ): Promise<ResponseLogout> {
    return await this.adminService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-user')
  async createUser(
    @Body() userData: CreateUserDto
  ): Promise<ResponseCreateUser> {
    return await this.adminService.addUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: number): Promise<ResponseDeleteUser> {
    return await this.adminService.removeUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ): Promise<ResponseGetAllusers> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.adminService.listUsers(pageNumber, limitNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/:id/toggle-subscription')
  async toggleSubscription(
    @Param('id') id: string
  ): Promise<ResponseToggleSubscription> {
    return await this.adminService.toggleSubscription(parseInt(id, 10));
  }
}
