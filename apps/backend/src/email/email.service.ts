import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';

import generalConfig from '@shared/config/general.config';
import authConfig from '@auth/config/auth.config';
import { ConfigType } from '@nestjs/config';
import { ResponseMessageEmail } from '@shared/dtos';
import { sendEmailAzure } from '@shared/nodemailer';
import { NewsDatabaseService, UserDatabaseService } from '@database';

@Injectable()
export class EmailService {
  constructor(
    private userDatabaseService: UserDatabaseService,
    private newsDatabaseService: NewsDatabaseService
  ) {}

  async getStatus(): Promise<string> {
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

    const { sentUsers, errorUsers } = await sendEmailAzure(
      users,
      email.title,
      email.content
    );
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
}
