import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Cron } from '@prisma/client';

@Injectable()
export class CronDatabaseService {
  constructor(private prisma: PrismaService) {}
  async createCron(data: Prisma.CronCreateInput): Promise<Cron> {
    return this.prisma.cron.create({ data });
  }
  async findManyCron(): Promise<Cron[]> {
    return this.prisma.cron.findMany();
  }
  async findUniqueCron(
    where: Prisma.CronWhereUniqueInput
  ): Promise<Cron | null> {
    return this.prisma.cron.findUnique({ where });
  }
  async deleteCron(where: Prisma.CronWhereUniqueInput): Promise<Cron> {
    return this.prisma.cron.delete({ where });
  }
  async updateCron(params: {
    where: Prisma.CronWhereUniqueInput;
    data: Prisma.CronUpdateInput;
  }): Promise<Cron> {
    return this.prisma.cron.update({ where: params.where, data: params.data });
  }
}
