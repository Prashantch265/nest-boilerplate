/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-25 12:26:24
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-26 00:18:31
 */

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import ExternalUsersModule from '../external-users/external-users.module';
import OtpConfigService from './otp-config.service';
import OtpController from './otp.controller';
import OTP from './otp.entity';
import OtpService from './otp.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([OTP]),
    MailerModule,
    ExternalUsersModule,
  ],
  providers: [OtpConfigService, OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export default class OtpModule {}
