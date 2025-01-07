import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDatabaseService } from '@database';

@Injectable()
export class AdminService {
  constructor(private readonly userDatabaseService: UserDatabaseService) {}

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    // Implement login logic here
    const token = 'your_generated_token'; // Replace with actual token generation logic
    return { token };
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
