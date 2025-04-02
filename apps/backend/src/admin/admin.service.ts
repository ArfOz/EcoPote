import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Admin, Tips, User } from '@prisma/client';
import {
  AdminDatabaseService,
  UserDatabaseService,
  TipsDatabaseService,
  NewsDatabaseService,
} from '@database';
import generalConfig from '@shared/config/general.config';
import authConfig from '@auth/config/auth.config';
import { ConfigType } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { AuthService } from '@auth/auth.service';

import { sendEmailAzure } from '@shared/nodemailer/azuremailer';

import { Prisma } from '@prisma/client';
import {
  ResponseCreateUser,
  ResponseDeleteUser,
  ResponseGetAllusers,
  ResponseLogin,
  ResponseLogout,
  ResponseMessageEmail,
  ResponseTips,
  ResponseTipsDetails,
} from '@shared/dtos';
import { CreateAddNewsDto } from './dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminDatabaseService: AdminDatabaseService,
    @Inject(generalConfig.KEY)
    private readonly generalCfg: ConfigType<typeof generalConfig>,
    @Inject(authConfig.KEY)
    private readonly authCfg: ConfigType<typeof authConfig>,
    private readonly userDatabaseService: UserDatabaseService,
    private readonly authService: AuthService,
    private readonly newsDatabaseService: NewsDatabaseService,
    private readonly tipsDatabaseService: TipsDatabaseService
  ) {}

  async addAdmin(adminData: {
    email: string;
    password: string;
  }): Promise<Admin> {
    try {
      if (adminData.email !== this.generalCfg.admin_Email) {
        throw new HttpException(
          'Only can be One admin',
          HttpStatus.UNAUTHORIZED
        );
      }
      const admin = await this.adminDatabaseService.findByEmail({
        email: adminData.email,
      });
      if (admin) {
        throw new HttpException('Admin already exists', HttpStatus.CONFLICT);
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
      adminData.password = hashedPassword;
      return this.adminDatabaseService.create(adminData);
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to add admin', HttpStatus.BAD_REQUEST);
    }
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ResponseLogin> {
    try {
      const admin = await this.adminDatabaseService.findByEmail({
        email: credentials.email,
      });

      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        admin.password
      );

      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      const token = await this.authService.login(admin.email, admin.id);

      await this.adminDatabaseService.update(admin.id, { token });
      return {
        data: { token },
        success: true,
        message: 'Logged in successfully',
      };
    } catch (error) {
      // Handle error
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }
  async logout(token: string): Promise<ResponseLogout> {
    try {
      const tokenWithoutBearer = token.replace('Bearer ', '');
      const decodedToken = await this.authService.decodeToken(
        tokenWithoutBearer
      );

      if (!decodedToken) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.adminDatabaseService.findOne({
        id: decodedToken.sub,
        token: tokenWithoutBearer,
      });

      if (!user) {
        throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
      }

      await this.adminDatabaseService.update(user.id, {
        token: null,
      });
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      // Handle error
      throw new HttpException('Logout failed', HttpStatus.BAD_REQUEST);
    }
  }

  async addUser(userData: {
    email: string;
    name: string;
    subscription?: boolean;
  }): Promise<ResponseCreateUser> {
    try {
      const user = await this.userDatabaseService.findByEmail({
        email: userData.email,
      });

      if (user) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const res = await this.userDatabaseService.create({
        ...userData,
        subscription: userData.subscription ?? false,
      });
      if (!res) {
        throw new HttpException('Failed to add user', HttpStatus.BAD_REQUEST);
      }

      return { message: 'User added successfully', success: true };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint failed
          throw new HttpException(
            'User with this email already exists',
            HttpStatus.CONFLICT
          );
        }
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to add user catch',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async removeUser(id: number): Promise<ResponseDeleteUser> {
    try {
      const res = await this.userDatabaseService.delete(id);
      return { message: `${res.email} deleted successfully`, success: true };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to remove user', HttpStatus.BAD_REQUEST);
    }
  }

  async listUsers(page?: number, limit?: number): Promise<ResponseGetAllusers> {
    try {
      if (!page || !limit) {
        const users = await this.userDatabaseService.findMany({});
        const total = await this.userDatabaseService.count({});
        return { success: true, message: '', data: { users, total } };
      }
      const skip: number = (page - 1) * limit;
      const take: number = limit;
      const [users, total] = await Promise.all([
        this.userDatabaseService.findMany({
          skip,
          take,
        }),
        this.userDatabaseService.count({}),
      ]);

      return { success: true, message: '', data: { users, total } };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to list users', HttpStatus.BAD_REQUEST);
    }
  }

  async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
  }): Promise<ResponseMessageEmail> {
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

      const { sentUsers, errorUsers } = await sendEmailAzure(
        users,
        emailData.subject,
        emailData.html
      );
      return {
        data: { sentUsers, errorUsers },
        success: true,
        message: 'Email sent successfully',
      };

      // return { data: res, success: true, message: 'Email sent successfully' };
    } catch (error) {
      // Handle error
      throw new HttpException('Failed to send email', HttpStatus.BAD_REQUEST);
    }
  }

  async toggleSubscription(
    userId: number
  ): Promise<{ data: User; message: string; success: boolean }> {
    try {
      const user = await this.userDatabaseService.findOne({ id: userId });
      const userUpdated = await this.userDatabaseService.update(
        { id: userId },
        { subscription: !user.subscription }
      );
      return {
        data: userUpdated,
        message: 'User updated successfully',
        success: true,
      };
    } catch (error) {
      // Handle error
      throw new HttpException(
        'Failed to toggle subscription',
        HttpStatus.BAD_REQUEST
      );
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

      console.log('tips', tips);

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

  async addNews(newsData: CreateAddNewsDto, html: string) {
    try {
      const tips = await this.tipsDatabaseService.findUnique({
        where: { id: parseInt(newsData.tipsId) },
      });
      if (!tips) {
        throw new HttpException('Tips not found', HttpStatus.NOT_FOUND);
      }

      await this.newsDatabaseService.createNews({
        title: newsData.title,
        content: html,
        tips: {
          connect: {
            id: parseInt(newsData.tipsId),
          },
        },
      });

      return { message: 'News added successfully', success: true };
    } catch (error) {
      // Handle error
      console.error('Error adding news:', error);
      throw new HttpException('Failed to add news', HttpStatus.BAD_REQUEST);
    }
  }
  async getNews() {
    try {
      const news = await this.newsDatabaseService.findAllNews();
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
  async updateNews(id: number, newsData: { title: string }, html: string) {
    try {
      await this.newsDatabaseService.updateNews(id, {
        title: newsData.title,
        content: html,
      });

      return { message: 'News updated successfully', success: true };
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

        console.log('tips', tips);
        const total = await this.newsDatabaseService.count({ tipsId: id });
        return { success: true, message: '', data: { ...tips[0], total } };
      }
      const skip: number = (page - 1) * limit;
      const take: number = limit;

      const tip = await this.tipsDatabaseService.findMany({
        where: {
          id: id,
        },
        skip,
        take,
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
