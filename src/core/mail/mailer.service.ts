import { Injectable, Logger } from '@nestjs/common';
import {
  ISendMailOptions,
  MailerService as NestMailerService,
} from '@nestjs-modules/mailer';
import { MailData } from './mailer.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly nestMailerService: NestMailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Sends an email using a pre-defined EJS template.
   * Allows for overriding the default "from" address.
   * @param data - The email data including receiver, subject, template, and context.
   */
  async sendMail(data: MailData): Promise<void> {
    try {
      const mailOptions: ISendMailOptions = {
        to: data.to,
        subject: data.subject,
        template: data.template,
        context: data.context,
      };

      // If a "from" address is provided in the data, use it.
      // Otherwise, the default from the MailerModule config will be used.
      if (data.from) {
        mailOptions.from = data.from;
      }

      await this.nestMailerService.sendMail(mailOptions);
      const recipient = Array.isArray(data.to) ? data.to.join(', ') : data.to;
      this.logger.log(`Email sent successfully to ${recipient}`);
    } catch (error) {
      this.logger.error(`Failed to send email`, error.stack);
    }
  }
}
