/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-06 22:05:22
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-09 15:17:16
 */

import { Injectable } from '@nestjs/common';
import ExternalUserService from '../external-users/external-users.service';
import OtpConfigService from './otp-config.service';
import { RecievedOtpDto, Type } from './otp.interface';
import otpGenerator from 'otp-generator';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { RuntimeException } from 'src/exceptions/runtime.exception';

@Injectable()
export default class OtpService {
  constructor(
    private readonly otpConfigService: OtpConfigService,
    private readonly externalUserService: ExternalUserService,
    private readonly mailerService: MailerService,
  ) {}

  AddMinutesToDate(date: any, minutes: any) {
    return new Date(date.getTime() + 60000 * minutes);
  }

  async generateEmailOtp(type: Type) {
    const {
      otpLength,
      digits,
      alphabets,
      upperCase,
      specialChar,
      expirationTime,
    } = await this.otpConfigService.findOneByField({ type: type });
    const otp = otpGenerator.generate(otpLength, {
      digits: digits,
      lowerCaseAlphabets: alphabets,
      upperCaseAlphabets: upperCase,
      specialChars: specialChar,
    });
    const now = new Date();
    const expiration_time = this.AddMinutesToDate(now, expirationTime);
    return { type: type, otp: otp, expirationTime: expiration_time };
  }

  async sendOtpOnMail(type: Type, email: string) {
    const { otp, expirationTime } = await this.generateEmailOtp(type);
    const user = await this.externalUserService.findOneByField({
      email: email,
    });
    user.otp = otp;
    user.otpExpirationTime = expirationTime;
    if (user.emailOtpVerified) user.emailOtpVerified = false;
    await this.externalUserService.update(user);
    const data: ISendMailOptions = {
      to: email,
      subject: 'Verify your email address',
      template: 'otp',
      context: {
        user: user.userName,
        otp: otp,
      },
    };
    return await this.mailerService.sendMail(data);
  }

  async verifyOtp(recievedOtp: RecievedOtpDto) {
    const { type, otp, email, phoneNo } = recievedOtp;
    let savedOtp;
    if (type === Type.WEB) {
      savedOtp = await this.externalUserService.findOneByField({
        where: {
          otpType: type,
          email: email,
          is_active: true,
          is_deleted: false,
        },
        select: ['otp', 'email', 'otpExpirationTime', 'emailOtpVerified'],
      });
    } else {
      savedOtp = await this.externalUserService.findOneByField({
        where: {
          otpType: type,
          phoneNo: phoneNo,
          is_active: true,
          is_deleted: false,
        },
        select: ['otp', 'otpExpirationTime', 'smsOtpVerified'],
      });
    }

    if (savedOtp.otp !== otp) {
      throw new RuntimeException(400, 'invalidOtp', 'email-otp-verification');
    }

    if (new Date() > savedOtp.otpExpirationTime)
      throw new RuntimeException(400, 'invalidOtp', 'email-otp-verification');

    if (type === Type.WEB)
      await this.externalUserService.update(
        { emailOtpVerified: true },
        { email: email, otp: otp, type: Type.WEB },
      );

    return { emailOtpVerified: true };
  }
}
