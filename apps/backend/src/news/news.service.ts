import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { News, Prisma, User } from '@prisma/client';

import generalConfig from '@shared/config/general.config';
import authConfig from '@auth/config/auth.config';
import { ConfigType } from '@nestjs/config';
import {
  ResponseNewsOrderDto,
  ResponseNewsAllDto,
  ResponseMessageNews,
  ResponseTips,
  ResponseTipsDetails,
  ResponseUpdateNews,
  CronTimeSetEnum,
} from '@shared/dtos';
import { sendEmailAzure, sendEmailsGmail } from '@shared/nodemailer';
import {
  NewsDatabaseService,
  TipsDatabaseService,
  UserDatabaseService,
} from '@database';
import { LogsDatabaseService } from '@database/logs';
import { CreateAddNewsDto, UpdateNewsDto } from './dtos';
import { TimeCalculator } from '@utils';
@Injectable()
export class NewsService {
  constructor(
    private userDatabaseService: UserDatabaseService,
    private newsDatabaseService: NewsDatabaseService,
    private readonly tipsDatabaseService: TipsDatabaseService,
    private readonly logger: LogsDatabaseService
  ) {
    if (process.env.NODE_ENV === 'production') {
      logger.setLogLevel('error'); // Only log errors in production
    } else {
      logger.setLogLevel('debug'); // Log everything in development
    }

    logger.setServiceName('admin-service');
  }

  async getStatus({ schedule }: { schedule: string }): Promise<string> {
    console.log(
      'Email service is running!',
      new Date().toISOString(),
      'schedule',
      schedule
    );
    return 'Email service is running!';
  }

  async sendNews(emailData: {
    to: string;
    subject: string;
    html: string;
  }): Promise<ResponseMessageNews> {
    try {
      const users: User[] = await this.userDatabaseService.findAll({
        where: { subscription: true },
      });

      if (users.length === 0) {
        throw new HttpException(
          'No users to send email to',
          HttpStatus.NOT_FOUND
        );
      }

      // const { sentUsers, errorUsers } = await sendEmailAzure(
      //   users,
      //   emailData.subject,
      //   emailData.html
      // );

      const { sentUsers, errorUsers } = await sendEmailsGmail(
        users,
        emailData.subject,
        emailData.html
      );
      return {
        data: { sentUsers, errorUsers },
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to send email', HttpStatus.BAD_REQUEST);
    }
  }

  async automatedNews({
    schedule,
    startDate,
  }: {
    schedule: keyof typeof CronTimeSetEnum;
    startDate: Date;
  }) {
    const users: User[] = await this.userDatabaseService.findAll({
      where: { subscription: true },
    });

    if (users.length === 0) {
      throw new HttpException(
        'No users to send email to',
        HttpStatus.NOT_FOUND
      );
    }

    const email = await this.newsDatabaseService.findFirst({ status: true });

    if (!email) {
      throw new HttpException('No news to send email to', HttpStatus.NOT_FOUND);
    }

    // const { sentUsers, errorUsers } = await sendEmailAzure(
    //   users,
    //   email.title,
    //   email.content
    // );

    const nextRun = TimeCalculator(schedule, startDate);

    const { sentUsers, errorUsers } = await sendEmailsGmail(
      users,
      email.title,
      email.content
    );

    const emailUpdate = await this.newsDatabaseService.updateNews(
      email.id,
      { status: false } // Update the status to false after sending
    );
    if (!emailUpdate) {
      throw new HttpException(
        'Failed to update email status',
        HttpStatus.BAD_REQUEST
      );
    }
    return {
      data: { sentUsers, errorUsers },
      success: true,
      message: 'Email sent successfully',
    };

    // return { data: res, success: true, message: 'Email sent successfully' };
  }
  catch(error) {
    // Handle error
    throw new HttpException('Failed to send email', HttpStatus.BAD_REQUEST);
  }

  async getNewsOrder(): Promise<ResponseNewsOrderDto> {
    const data = await this.newsDatabaseService.findMany({
      where: { status: true },
      orderBy: { createdAt: 'asc' },
      include: {
        tips: {
          select: {
            title: true,
          },
        },
      },
    });

    return {
      data,
      success: true,
      message: 'Emails retrieved successfully',
    };
  }

  async allNews(
    page: number,
    limit: number,
    order: string,
    status?: boolean
  ): Promise<ResponseNewsAllDto> {
    const where: Prisma.NewsWhereInput = {};
    const skip: number = page * limit;
    const take: number = limit;
    if (status !== undefined) {
      where.status = status;
    }

    if (!page || !limit) {
      const emails = await this.newsDatabaseService.findMany({
        where,
        orderBy: { createdAt: 'asc' },
      });

      const total = await this.newsDatabaseService.count(where);
      return { success: true, message: '', data: { emails, total } };
    }

    // const orderBy: Prisma.NewsOrderByWithRelationInput;
    const emails = await this.newsDatabaseService.findMany({
      orderBy: { createdAt: 'asc' },
      where,
    });
    const total = await this.newsDatabaseService.count(where);

    return {
      data: { emails, total },
      success: true,
      message: 'Emails retrieved successfully',
    };
  }

  async addNews(newsData: CreateAddNewsDto, html: string) {
    try {
      const tips = await this.tipsDatabaseService.findUnique({
        where: { id: parseInt(newsData.tipsId) },
      });
      if (!tips) {
        throw new HttpException('Tips not found', HttpStatus.NOT_FOUND);
      }

      const emailStatus = newsData.status === 'true' ? true : false;

      const data = await this.newsDatabaseService.createNews({
        title: newsData.title,
        content: html,
        status: emailStatus,
        tips: {
          connect: {
            id: parseInt(newsData.tipsId),
          },
        },
      });

      return { message: 'News added successfully', success: true, data };
    } catch (error) {
      // Handle error
      console.error('Error adding news:', error);
      throw new HttpException('Failed to add news', HttpStatus.BAD_REQUEST);
    }
  }
  async getNews(id: number, page?: number, limit?: number) {
    try {
      const news = await this.newsDatabaseService.findMany({
        where: { tipsId: id },
        take: limit,
        skip: (page - 1) * limit,
      });
      const total = await this.newsDatabaseService.count({ tipsId: id });
      return {
        data: { news, total },
        message: 'News fetched successfully',
        success: true,
      };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to fetch news', HttpStatus.BAD_REQUEST);
    }
  }
  async getNewsById(id: number) {
    try {
      const news = await this.newsDatabaseService.findNewsById(id);
      return {
        data: news,
        message: 'News fetched successfully',
        success: true,
      };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to fetch news', HttpStatus.BAD_REQUEST);
    }
  }
  async updateNews(
    id: number,
    newsData: UpdateNewsDto,
    file: string
  ): Promise<ResponseUpdateNews> {
    try {
      console.log('datalar', newsData, id);
      const news = await this.newsDatabaseService.findNewsById(id);
      if (!news) {
        throw new HttpException('News not found', HttpStatus.NOT_FOUND);
      }
      const tips = await this.tipsDatabaseService.findUnique({
        where: { id: news.tipsId },
      });
      if (!tips) {
        throw new HttpException('Tips not found', HttpStatus.NOT_FOUND);
      }

      if (
        newsData.status !== undefined &&
        newsData.status !== 'true' &&
        newsData.status !== 'false'
      ) {
        throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
      }

      const emailStatus = newsData.status === 'true' ? true : false;

      const data: Prisma.NewsUpdateInput = {
        status: emailStatus,
      };

      if (newsData.title !== undefined) {
        data.title = newsData.title;
      }
      if (file) {
        data.content = file;
      }

      const updatedNews = await this.newsDatabaseService.updateNews(id, data);
      if (!updatedNews) {
        throw new HttpException(
          'Failed to update news',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        message: 'News updated successfully',
        success: true,
        data: updatedNews,
      };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to update news', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteNews(id: number) {
    try {
      const news = await this.newsDatabaseService.deleteNews(id);
      return {
        data: news,
        message: 'News deleted successfully',
        success: true,
      };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to delete news', HttpStatus.BAD_REQUEST);
    }
  }

  async addTips(
    tipsData: { title: string; description: string },
    html?: string
  ): Promise<{ message: string; success: boolean }> {
    try {
      const tips = await this.tipsDatabaseService.findMany({
        where: { title: tipsData.title },
      });

      if (tips.length > 0) {
        // Tips already exist
        throw new HttpException('Tips already exists', HttpStatus.CONFLICT);
      }

      const data: Prisma.TipsCreateInput = {
        title: tipsData.title,
        description: tipsData.description,
      };
      console.log('html', html);
      if (html) {
        data.news = {
          create: {
            title: tipsData.title,
            content: html,
          },
        };
      }

      const response = await this.tipsDatabaseService.createTips(data);

      if (!response) {
        throw new HttpException('Failed to add tips', HttpStatus.BAD_REQUEST);
      }

      return { message: 'Tips added successfully', success: true };
    } catch (error) {
      if (error) {
        throw new HttpException(error.response, error.status);
      }
      // Handle error
      throw new HttpException('Failed to add tips', HttpStatus.BAD_REQUEST);
    }
  }
  async getTips(): Promise<ResponseTips> {
    try {
      const tips = await this.tipsDatabaseService.findMany({});
      return {
        data: {
          tips: tips,
          total: tips.length,
        },
        message: 'Tips fetched successfully',
        success: true,
      };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to fetch tips', HttpStatus.BAD_REQUEST);
    }
  }

  async getTipsById(
    id: number,
    page?: number,
    limit?: number
  ): Promise<ResponseTipsDetails> {
    const select: Prisma.TipsSelect = {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      news: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          status: true,
        },
      },
    };
    try {
      if (!page || !limit) {
        const tips = await this.tipsDatabaseService.findMany({
          where: {
            id: id,
          },
          select,
        });

        const total = await this.newsDatabaseService.count({ tipsId: id });
        return { success: true, message: '', data: { ...tips[0], total } };
      }

      if (page || limit) {
        const skip: number = (page - 1) * limit;
        const take: number = limit;
        select.news = {
          take,
          skip,
        };
      }
      const tip = await this.tipsDatabaseService.findMany({
        where: {
          id: id,
        },
        select,
      });

      if (!tip) {
        throw new HttpException('Tips not found', HttpStatus.NOT_FOUND);
      }

      console.log('tip', tip);

      const total = await this.newsDatabaseService.count({ tipsId: id });
      return {
        data: { ...(Array.isArray(tip) ? tip[0] : tip), total },
        message: 'Tips fetched successfully',
        success: true,
      };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to fetch tips', HttpStatus.BAD_REQUEST);
    }
  }
}
