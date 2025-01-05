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
    const user = await this.userDatabaseService.findByEmail({
      email: data.email,
    });
    if (user) {
      switch (user.subscription) {
        case true:
          return { error: 'User already subscribed' };
        case false:
          return this.userDatabaseService.update(user.id, {
            subscription: true,
          });
      }
    }

    return this.userDatabaseService.create(data);
  }

  async unregister(data: { email: string }): Promise<User | { error: string }> {
    const user = await this.userDatabaseService.findByEmail({
      email: data.email,
    });

    if (!user) {
      return { error: 'User not found' };
    }
    return this.userDatabaseService.update(user.id, { subscription: false });
  }

  async delete(id: number): Promise<void> {
    await this.userDatabaseService.delete(id);
  }

  async findAll(): Promise<User[]> {
    return this.userDatabaseService.findAll({});
  }

  async update(data: Partial<User>): Promise<User | { error: string }> {
    return this.userDatabaseService.update(data.id, data);
  }
}
