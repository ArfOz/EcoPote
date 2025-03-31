import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tips } from '@prisma/client';

@Injectable()
export class TipsDatabaseService {
  constructor(private prisma: PrismaService) {}
  async createTips(data: Prisma.TipsCreateInput): Promise<Tips> {
    return this.prisma.tips.create({ data });
  }
  async findManyTips(where?: Prisma.TipsWhereInput): Promise<Tips[]> {
    return this.prisma.tips.findMany({
      where,
    });
  }

  async findUniqueTips(
    where: Prisma.TipsWhereUniqueInput,
    select?: Prisma.TipsSelect,
    include?: Prisma.TipsInclude
  ): Promise<Tips | null> {
    return this.prisma.tips.findUnique({ where, select });
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

  async count(where?: Prisma.TipsWhereInput): Promise<number> {
    return this.prisma.tips.count({ where });
  }
}
