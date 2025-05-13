import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDatabaseService } from '@database';
import { ResponseUnregisterUserDto } from '@shared/dtos';

@Injectable()
export class UserService {
  constructor(private userDatabaseService: UserDatabaseService) {}

  async register(data: {
    email: string;
    name: string;
    subscription: boolean;
  }): Promise<User | { error: string }> {
    const user = await this.userDatabaseService.findAll({
      where: { email: data.email },
    });
    if (user[0]) {
      await this.userDatabaseService.update(
        { id: user[0].id },
        { subscription: true }
      );
      return user[0];
    }
    return this.userDatabaseService.create(data);
  }

  async unregister(data: {
    email: string;
  }): Promise<ResponseUnregisterUserDto> {
    const user = await this.userDatabaseService.findOne({
      email: data.email,
      subscription: true,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updatedUser = await this.userDatabaseService.update(
      { id: user.id },
      { subscription: false }
    );
    return {
      message: 'User successfully unregistered',
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    } as ResponseUnregisterUserDto;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return await this.userDatabaseService.update({ id }, data);
  }

  async delete(id: number): Promise<User> {
    return await this.userDatabaseService.delete(id);
  }
}
