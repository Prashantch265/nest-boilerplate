/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-06 22:05:22
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-25 23:26:41
 */

import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import ExternalUserService from '@core/external-users/external-users.service';
import { RuntimeException } from '@exceptions/runtime.exception';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import otpGenerator from 'otp-generator';
import OtpConfigService from './otp-config.service';
import { OtpType, RecievedOtpDto } from './otp.dto';

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

  async generateEmailOtp(otpType: OtpType) {
    const {
      otpLength,
      digits,
      alphabets,
      upperCase,
      specialChar,
      expirationTime,
    } = await this.otpConfigService.findOneByField({ type: otpType });
    const otp = otpGenerator.generate(otpLength, {
      digits: digits,
      lowerCaseAlphabets: alphabets,
      upperCaseAlphabets: upperCase,
      specialChars: specialChar,
    });
    const now = new Date();
    const expiration_time = this.AddMinutesToDate(now, expirationTime);
    return { type: otpType, otp: otp, expirationTime: expiration_time };
  }

  async sendOtpOnMail(type: OtpType, email: string) {
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
    if (type === OtpType.WEB) {
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
      throw new RuntimeException(
        400,
        ErrorMessage.INVALID_OTP,
        'email-otp-verification',
      );
    }

    if (new Date() > savedOtp.otpExpirationTime)
      throw new RuntimeException(
        400,
        ErrorMessage.INVALID_OTP,
        'email-otp-verification',
      );

    if (type === OtpType.WEB)
      await this.externalUserService.update(
        { emailOtpVerified: true },
        { email: email, otp: otp, type: OtpType.WEB },
      );

    return { emailOtpVerified: true };
  }
}
