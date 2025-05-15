import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { News, Prisma, User } from '@prisma/client';

import generalConfig from '@shared/config/general.config';
import authConfig from '@auth/config/auth.config';
import { ConfigType } from '@nestjs/config';
import {
  ResponseEmailOrderDto,
  ResponseEmailsAllDto,
  ResponseMessageEmail,
} from '@shared/dtos';
import { sendEmailAzure, sendEmail, sendEmailsGmail } from '@shared/nodemailer';
import { NewsDatabaseService, UserDatabaseService } from '@database';
import { LogsDatabaseService } from '@database/logs';

@Injectable()
export class EmailService {
  constructor(
    private userDatabaseService: UserDatabaseService,
    private newsDatabaseService: NewsDatabaseService,
    private readonly logger: LogsDatabaseService
  ) {
    if (process.env.NODE_ENV === 'production') {
      logger.setLogLevel('error'); // Only log errors in production
    } else {
      logger.setLogLevel('debug'); // Log everything in development
    }

    logger.setServiceName('admin-service');
  }

  async getStatus(): Promise<string> {
    console.log('Email service is running!', new Date().toISOString());
    return 'Email service is running!';
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

  async automatedEmail() {
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

  async getEmailsOrder(): Promise<ResponseEmailOrderDto> {
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

  async allEmails(
    page: number,
    limit: number,
    order: string,
    status?: boolean
  ): Promise<ResponseEmailsAllDto> {
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
}
