import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { loggerService } from 'src/utils/logger';

@Injectable()
export default class NodeMailerService {
  constructor(private readonly mailerService: MailerService) {}
  public sendMail(options: ISendMailOptions): void {
    this.mailerService
      .sendMail(options)
      .then((sentMessagInfo) => console.log(sentMessagInfo))
      .catch((err) => loggerService().error(err));
  }
}
