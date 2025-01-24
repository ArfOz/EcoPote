import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDatabaseService } from '@database';

@Injectable()
export class UserService {
  constructor(private userDatabaseService: UserDatabaseService) {}

  async register(data: {
    email: string;
    subscription: boolean;
  }): Promise<User | { error: string }> {
    const user = await this.userDatabaseService.findAll({
      where: { email: data.email },
    });
    if (user[0]) {
      return { error: 'User already exists' };
    }
    return this.userDatabaseService.create(data);
  }

  async unregister(data: { email: string }): Promise<User | { error: string }> {
    const user = await this.userDatabaseService.findAll({
      where: { email: data.email },
    });

    if (!user) {
      return { error: 'User not found' };
    }
    return await this.userDatabaseService.update(
      { id: user[0].id },
      { subscription: false }
    );
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return await this.userDatabaseService.update({ id }, data);
  }

  async delete(id: number): Promise<User> {
    return await this.userDatabaseService.delete(id);
  }
}
