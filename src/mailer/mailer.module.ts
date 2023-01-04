import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { mailerConfigs } from './mailer.configs';
import NodeMailerService from './mailer.service';

@Module({
  imports: [MailerModule.forRoot(mailerConfigs())],
  providers: [NodeMailerService],
  exports: [MailerModule, NodeMailerService],
})
export default class NodeMailerModule {}
