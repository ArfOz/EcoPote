import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, News } from '@prisma/client';

@Injectable()
export class NewsDatabaseService {
  constructor(private prisma: PrismaService) {}

  async createNews(data: Prisma.NewsCreateInput): Promise<News> {
    return this.prisma.news.create({
      data,
    });
  }

  async findMany(params: {
    where?: Prisma.NewsWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.NewsOrderByWithRelationInput;
  }): Promise<News[]> {
    return this.prisma.news.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy,
    });
  }

  async findNewsById(id: number): Promise<News | null> {
    return this.prisma.news.findUnique({
      where: { id },
    });
  }
  async count(where?: Prisma.NewsWhereInput): Promise<number> {
    return this.prisma.news.count({ where });
  }

  async updateNews(id: number, data: Prisma.NewsUpdateInput): Promise<News> {
    return this.prisma.news.update({
      where: { id },
      data,
    });
  }

  async deleteNews(id: number): Promise<News> {
    return this.prisma.news.delete({
      where: { id },
    });
  }
}
