import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserDatabaseService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { where?: Prisma.UserWhereInput }): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: params.where,
    });
  }
  async findByEmail(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
    });
  }
  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
    });
  }

  async create(data: { email: string; subscription: boolean }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
