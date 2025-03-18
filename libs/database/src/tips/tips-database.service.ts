import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tips } from '@prisma/client';

@Injectable()
export class TipsDatabaseService {
  constructor(private prisma: PrismaService) {}
  async createTips(data: Prisma.TipsCreateInput): Promise<Tips> {
    return this.prisma.tips.create({ data });
  }
  async findManyCron(): Promise<Tips[]> {
    return this.prisma.tips.findMany({});
  }
  async findUniqueTips(
    where: Prisma.TipsWhereUniqueInput
  ): Promise<Tips | null> {
    return this.prisma.tips.findUnique({ where });
  }
  async deleteTips(where: Prisma.TipsWhereUniqueInput): Promise<Tips> {
    return this.prisma.tips.delete({ where });
  }
  async updateTips(params: {
    where: Prisma.TipsWhereUniqueInput;
    data: Prisma.TipsUpdateInput;
  }): Promise<Tips> {
    return this.prisma.tips.update({ where: params.where, data: params.data });
  }
}
