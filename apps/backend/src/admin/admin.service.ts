import { Inject, Injectable } from '@nestjs/common';
import { Admin, User } from '@prisma/client';
import { AdminDatabaseService, UserDatabaseService } from '@database';
import generalConfig from '@shared/config/general.config';
import authConfig from '@shared/config/auth.config';
import { ConfigType } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AuthService } from '@auth';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminDatabaseService: AdminDatabaseService,
    @Inject(generalConfig.KEY)
    private readonly generalCfg: ConfigType<typeof generalConfig>,
    @Inject(authConfig.KEY)
    private readonly authCfg: ConfigType<typeof authConfig>,
    private readonly userDatabaseService: UserDatabaseService,
    private readonly authService: AuthService
  ) {}

  async addAdmin(adminData: {
    email: string;
    password: string;
  }): Promise<Admin> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
    adminData.password = hashedPassword;
    return this.adminDatabaseService.create(adminData);
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ access_token: string }> {
    const admin = await this.adminDatabaseService.findByEmail({
      email: credentials.email,
    });

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      admin.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return this.authService.login(credentials);
  }
  async logout(userId: number): Promise<void> {
    // Implement logout logic here
    // For example, you can invalidate the user's token or remove the session
    console.log(`User with ID ${userId} has been logged out.`);
  }

  async addUser(userData: {
    email: string;
    subscription: boolean;
  }): Promise<User> {
    return this.userDatabaseService.create(userData);
  }

  async removeUser(id: number): Promise<void> {
    await this.userDatabaseService.delete(id);
  }

  async listUsers(): Promise<User[]> {
    return this.userDatabaseService.findAll({});
  }
}
