import { UserDatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userDatabaseService: UserDatabaseService) {}

  // async findAll(): Promise<User[]> {
  //   return this.userDatabaseService.findAll();
  // }

  async findOne(id: number): Promise<User | null> {
    return this.userDatabaseService.findOne(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.userDatabaseService.findAll({
      where: { email },
    });
    return users[0] || null;
  }

  async create(data: {
    email: string;
    subscripton: boolean;
  }): Promise<User | { error: string }> {
    const user = await this.findByEmail(data.email);
    console.log(user);
    if (user) {
      return { error: 'User already exists' };
    }
    return this.userDatabaseService.create(data);
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.userDatabaseService.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.userDatabaseService.delete(id);
  }
}
