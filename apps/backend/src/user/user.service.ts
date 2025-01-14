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
    console.log('userunregister', data.email);

    const user = await this.userDatabaseService.findAll({
      where: { email: data.email },
    });

    console.log('userunregister', user);
    if (!user) {
      return { error: 'User not found' };
    }
    // return this.userDatabaseService.update({

    // });
    return { error: 'Not implemented' };
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.userDatabaseService.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.userDatabaseService.delete(id);
  }
}
