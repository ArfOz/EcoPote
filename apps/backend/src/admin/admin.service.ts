import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Admin, User } from '@prisma/client';
import { AdminDatabaseService, UserDatabaseService } from '@database';
import generalConfig from '@shared/config/general.config';
import authConfig from '@auth/config/auth.config';
import { ConfigType } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { AuthService } from '@auth/auth.service';

import { sendBulkEmails } from '@shared/nodemailer';

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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
    adminData.password = hashedPassword;
    return this.adminDatabaseService.create(adminData);
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string; Success: boolean }> {
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

    console.log('Admin logged in:', admin.email);
    const token = await this.authService.login(admin.email, admin.id);

    await this.adminDatabaseService.update(admin.id, { token });
    return {
      token,
      Success: true,
    };
  }
  async logout(token: string): Promise<{ message: string; Success: boolean }> {
    // Implement logout logic here
    // For example, you can invalidate the user's token or remove the session
    console.log('Logging out user with token:', token);
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const decodedToken = await this.authService.decodeToken(tokenWithoutBearer);

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

    // Invalidate the token or remove the session here
    await this.adminDatabaseService.update(user.id, {
      token: null,
    });
    console.log(`User with ID  has been logged out.`);
    return { Success: true, message: 'Logged out successfully' };
  }

  async addUser(userData: {
    email: string;
    subscription: boolean;
  }): Promise<User> {
    return this.userDatabaseService.create(userData);
  }

  async removeUser(id: number): Promise<User> {
    return await this.userDatabaseService.delete(id);
  }

  async listUsers(
    page: number,
    limit: number
  ): Promise<{ users: User[]; total: number }> {
    const skip: number = (page - 1) * limit;
    const take: number = limit;
    const [users, total] = await Promise.all([
      this.userDatabaseService.findMany({
        skip,
        take,
      }),
      this.userDatabaseService.count({}),
    ]);

    return { users, total };
  }

  async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ message: string; Sucess: boolean }> {
    const users: User[] = await this.userDatabaseService.findAll({
      where: { subscription: true },
    });

    if (users.length === 0) {
      console.log('No users to send email to');
      throw new HttpException(
        'No users to send email to',
        HttpStatus.NOT_FOUND
      );
    }

    // console.log('Sending email to users:', users);
    const res = await sendBulkEmails(users, emailData.subject, emailData.html);
    // Email sending result can be logged if needed
    console.log('Email sending result:', res);

    return { message: res, Sucess: true };
  }

  async toggleSubscription(userId: number): Promise<User> {
    const user = await this.userDatabaseService.findOne({ id: userId });
    return await this.userDatabaseService.update(
      { id: userId },
      { subscription: !user.subscription }
    );
  }
}
