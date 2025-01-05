import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDatabaseService } from '@database';

@Injectable()
export class AdminService {
  constructor(private readonly userDatabaseService: UserDatabaseService) {}

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
