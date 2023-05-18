/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-25 12:26:24
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 14:57:53
 */

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import ExternalUsersModule from '../external-users/external-users.module';
import OtpConfigService from './otp-config.service';
import OtpController from './otp.controller';
import OTP from './otp.entity';
import OtpService from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OTP]), MailerModule, ExternalUsersModule],
  providers: [OtpConfigService, OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export default class OtpModule {}
