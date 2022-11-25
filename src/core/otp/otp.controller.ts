/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:55:19
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-25 12:51:57
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ResponseMessage } from 'src/decorators/response.decorator';
import OtpConfigService from './otp-config.service';
import {
  GetNewOtpParams,
  OtpConfiguration,
  RecievedOtp,
} from './otp.interface';
import OtpService from './otp.service';

@Controller('otp')
export default class OtpController {
  constructor(
    private readonly otpConfigService: OtpConfigService,
    private readonly otpService: OtpService,
  ) {}

  @ResponseMessage('fetch', 'New OTP')
  @Get('/')
  async getNewOtp(@Query() params: GetNewOtpParams) {
    // if (params.type === 'web') {
    //   return await this.otpService.sendOtpOnMail(params.type, params.email);
    // }
    return null;
  }

  @ResponseMessage('verify', 'OTP')
  @Post('/')
  async verifyOtp(@Body() otp: RecievedOtp) {
    // return await this.otpService.verifyOtp(otp);
  }

  @ResponseMessage('fetch', 'OTP Configurations')
  @Get('/config')
  async getAllOtpConfig() {
    return await this.otpConfigService.getAllOtpConfig();
  }

  @ResponseMessage('create', 'OTP Configurations')
  @Post('/config')
  async addOtpConfig(@Body() data: OtpConfiguration) {
    return await this.otpConfigService.addOtpConfig(data);
  }

  @ResponseMessage('fetch', 'OTP Configurations')
  @Get('/config/:id')
  async getById(@Param('id') id: number) {
    return await this.otpConfigService.getOtpConfigById(id);
  }

  @ResponseMessage('update', 'OTP configurations')
  @Put('/config/:id')
  async updateOtpConfig(
    @Param('id') id: number,
    @Body() data: OtpConfiguration,
  ) {
    return await this.otpConfigService.updateOtpConfig(id, data);
  }

  @ResponseMessage('delete', 'OTP configurations')
  @Delete('/config/:id')
  async deleteOtpConfig(@Param('id') id: number) {
    return await this.otpConfigService.deleteOtpConfig(id);
  }
}
