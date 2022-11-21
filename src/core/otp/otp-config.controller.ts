/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:55:19
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-16 21:00:07
 */

import { Controller, Get } from '@nestjs/common';
import { ResponseMessage } from 'src/decorators/response.decorator';
import OtpConfigService from './otp-config.service';

@Controller('otp-config')
export default class OtpConfigController {
  constructor(private readonly otpConfigService: OtpConfigService) {}

  @ResponseMessage('fetch', 'OTP Configurations')
  @Get()
  async getAllOtpConfig() {
    return await this.otpConfigService.getAllOtpConfig();
  }
}
