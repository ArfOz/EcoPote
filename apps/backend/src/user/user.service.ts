import { UserDatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userDatabaseService: UserDatabaseService) {}

  async findAll(): Promise<User[]> {
    return this.userDatabaseService.findAll();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userDatabaseService.findOne(id);
  }

  async create(data: { email: string; subscripton: boolean }): Promise<User> {
    return this.userDatabaseService.create(data);
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.userDatabaseService.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.userDatabaseService.delete(id);
  }
}
