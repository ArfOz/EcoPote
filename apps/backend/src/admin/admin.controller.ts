import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
/**
 * Controller for managing admin-related operations.
 */
export class AdminController {
  /**
   * Creates an instance of AdminController.
   * @param adminService - The service used to manage admin operations.
   */
  constructor(private readonly adminService: AdminService) {}
  /**
   * Logs in an admin.
   * @param credentials - The login credentials.
   * @returns A promise that resolves to a JWT token.
   */
  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string }
  ): Promise<{ token: string }> {
    return this.adminService.login(credentials);
  }

  /**
   * Logs out an admin.
   * @param id - The ID of the admin to be logged out.
   * @returns A promise that resolves when the admin is logged out.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Body() { id }: { id: number }): Promise<void> {
    return this.adminService.logout(id);
    // (id: number): Promise<void> {
    //   // Implement the logout logic here
    //   // For example, you might want to invalidate the admin's JWT token or remove their session
    //   return Promise.resolve();
    // }
  }
  /**
   * Creates a new user.
   * @param userData - The data of the user to be created.
   * @returns A promise that resolves to the created user.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('users')
  async createUser(
    @Body() userData: { email: string; subscription: boolean }
  ): Promise<User> {
    return this.adminService.addUser(userData);
  }

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
