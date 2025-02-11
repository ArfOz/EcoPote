import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_WEEK)
  async sendWeeklyEmails() {
    await this.sendScheduledEmails();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendEmailsEveryMinute() {
    await this.sendScheduledEmails();
  }

  private async sendScheduledEmails() {
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

      const emailData = {
        subject: 'Scheduled Email',
        html: '<p>This is a scheduled email.</p>',
      };

      const res = await sendBulkEmails(
        users,
        emailData.subject,
        emailData.html
      );

      console.log('Scheduled emails sent successfully', res);
    } catch (error) {
      console.error('Failed to send scheduled emails', error);
    }
  }
}
