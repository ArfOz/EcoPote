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

  async create(data: {
    email: string;
    subscription: boolean;
    name: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
  async count(params: { where?: Prisma.UserWhereInput }): Promise<number> {
    return this.prisma.user.count({
      where: params.where,
    });
  }
  async findMany(params: {
    where?: Prisma.UserWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy,
    });
  }
}
