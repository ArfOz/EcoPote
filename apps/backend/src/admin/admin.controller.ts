import { JwtAuthGuard, LocalAuthGuard } from '@auth';
import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { User, Admin } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import generalConfig from '@shared/config/general.config';
import { ConfigType } from '@nestjs/config';

@Controller('admin')
/**
 * Controller for managing admin-related operations.
 */
export class AdminController {
  /**
   * Creates an instance of AdminController.
   * @param adminService - The service used to manage admin operations.
   */
  constructor(
    private readonly adminService: AdminService,
    private readonly generalCfg: ConfigType<typeof generalConfig>
  ) {}
  /**
   * Logs in an admin.
   * @param credentials - The login credentials.
   * @returns A promise that resolves to a JWT token.
   */

  async createAdmin(
    @Body() adminData: { email: string; password: string }
  ): Promise<Admin> {
    return this.adminService.addAdmin(adminData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.adminService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    // Implement logout logic, e.g., invalidate JWT token
  }
  /**
   * Creates a new user.
   * @param userData - The data of the user to be created.
   * @returns A promise that resolves to the created user.
   */
  // @UseGuards(AuthGuard('jwt'))
  // @Post('users')
  // async createUser(
  //   @Body() userData: { email: string; subscription: boolean }
  // ): Promise<User> {
  //   return this.adminService.addUser(userData);
  // }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to be deleted.
   * @returns A promise that resolves when the user is deleted.
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete('users/:id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.adminService.removeUser(id);
  }

  /**
   * Retrieves all users.
   * @returns A promise that resolves to an array of users.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.adminService.listUsers();
  }
}
