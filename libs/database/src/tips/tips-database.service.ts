import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tips } from '@prisma/client';
import { take } from 'rxjs';

@Injectable()
export class TipsDatabaseService {
  constructor(private prisma: PrismaService) {}
  async createTips(data: Prisma.TipsCreateInput): Promise<Tips> {
    return this.prisma.tips.create({ data });
  }
  async findMany(params: {
    where?: Prisma.TipsWhereInput;
    take?: number;
    skip?: number;
    orderBy?: Prisma.TipsOrderByWithRelationInput;
    select?: Prisma.TipsSelect;
  }): Promise<Tips[]> {
    const { where, orderBy, take, skip, select } = params;
    return this.prisma.tips.findMany({
      where,
      orderBy,
      take,
      skip,
      select,
    });
  }

  async findUnique(params: {
    where: Prisma.TipsWhereUniqueInput;
    select?: Prisma.TipsSelect;
  }): Promise<Tips | null> {
    return this.prisma.tips.findUnique(params);
  }
  async deleteTips(where: Prisma.TipsWhereUniqueInput): Promise<Tips> {
    return this.prisma.tips.delete({ where });
  }
  async update(params: {
    where: Prisma.TipsWhereUniqueInput;
    data: Prisma.TipsUpdateInput;
  }): Promise<Tips> {
    return this.prisma.tips.update({ where: params.where, data: params.data });
  }

  async count(where?: Prisma.TipsWhereInput): Promise<number> {
    return this.prisma.tips.count({ where });
  }
}
