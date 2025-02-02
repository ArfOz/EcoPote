import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Admin, User } from '@prisma/client';
import { AdminDatabaseService, UserDatabaseService } from '@database';
import generalConfig from '@shared/config/general.config';
import authConfig from '@auth/config/auth.config';
import { ConfigType } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { AuthService } from '@auth/auth.service';

import { sendBulkEmails } from '@shared/nodemailer';
import { Prisma } from '@prisma/client';
import {
  ResponseCreateUser,
  ResponseDeleteUser,
  ResponseGetAllusers,
  ResponseLogin,
  ResponseLogout,
  ResponseMessageEmail,
} from '@shared/dtos';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminDatabaseService: AdminDatabaseService,
    @Inject(generalConfig.KEY)
    private readonly generalCfg: ConfigType<typeof generalConfig>,
    @Inject(authConfig.KEY)
    private readonly authCfg: ConfigType<typeof authConfig>,
    private readonly userDatabaseService: UserDatabaseService,
    private readonly authService: AuthService
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

      const res = await sendBulkEmails(
        users,
        emailData.subject,
        emailData.html
      );

      return { data: res, success: true, message: 'Email sent successfully' };
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
}
