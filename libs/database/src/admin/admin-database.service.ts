import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Admin } from '@prisma/client';

@Injectable()
export class AdminDatabaseService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { where?: Prisma.AdminWhereInput }): Promise<Admin[]> {
    return await this.prisma.admin.findMany({
      where: params.where,
    });
  }
  async findByEmail(where: Prisma.AdminWhereInput): Promise<Admin | null> {
    return this.prisma.admin.findFirst({
      where,
    });
  }
  async findOne(where: Prisma.AdminWhereUniqueInput): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where,
    });
  }

  async create(data: { email: string; password: string }): Promise<Admin> {
    return this.prisma.admin.create({
      data,
    });
  }

  async update(id: number, data: Partial<Admin>): Promise<Admin> {
    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.admin.delete({
      where: { id },
    });
  }
}
