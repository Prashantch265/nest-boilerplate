/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-25 12:26:24
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-25 12:28:41
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OtpConfigService from './otp-config.service';
import OtpController from './otp.controller';
import OTP from './otp.entity';
import OtpService from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([OTP])],
  providers: [OtpConfigService, OtpService],
  controllers: [OtpController],
})
export default class OtpModule {}
