import { Inject, Injectable } from '@nestjs/common';
import { Admin, User } from '@prisma/client';
import { AdminDatabaseService, UserDatabaseService } from '@database';
import generalConfig from '@shared/config/general.config';
import authConfig from '@shared/config/auth.config';
import { ConfigType } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { AuthService } from '@auth';

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
  }): Promise<{ token: string }> {
    const admin = await this.adminDatabaseService.findByEmail({
      email: credentials.email,
    });

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      admin.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return this.authService.login(credentials);
  }
  async logout(userId: number): Promise<void> {
    // Implement logout logic here
    // For example, you can invalidate the user's token or remove the session
    console.log(`User with ID ${userId} has been logged out.`);
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
  }): Promise<string> {
    const users: User[] = await this.userDatabaseService.findAll({
      where: { subscription: true },
    });

    if (users.length === 0) {
      console.log('No users to send email to');
      return;
    }

    // console.log('Sending email to users:', users);
    const res = await sendBulkEmails(users, emailData.subject, emailData.html);
    // Email sending result can be logged if needed
    console.log('Email sending result:', res);

    return res;
  }

  async toggleSubscription(userId: number): Promise<User> {
    const user = await this.userDatabaseService.findOne({ id: userId });
    return await this.userDatabaseService.update(
      { id: userId },
      { subscription: !user.subscription }
    );
  }
}
