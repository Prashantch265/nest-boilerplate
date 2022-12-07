/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-25 12:26:24
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-06 23:01:36
 */

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ExternalUsersModule from '../external-users/external-users.module';
import OtpConfigService from './otp-config.service';
import OtpController from './otp.controller';
import OTP from './otp.entity';
import OtpService from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([OTP]), MailerModule, ExternalUsersModule],
  providers: [OtpConfigService, OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export default class OtpModule {}
