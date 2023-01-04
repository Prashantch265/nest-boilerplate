/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:55:19
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-09 15:14:29
 */

import { SuccessMessage } from '@core/Common/interfaces/common.interface';
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
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/response.decorator';
import OtpConfigService from './otp-config.service';
import {
  GetNewOtpParamsDto,
  OtpConfigurationDto,
  RecievedOtpDto,
} from './otp.dto';
import OtpService from './otp.service';

@Controller('otp')
export default class OtpController {
  constructor(
    private readonly otpConfigService: OtpConfigService,
    private readonly otpService: OtpService,
  ) {}

  @ApiTags('otp')
  @ResponseMessage(SuccessMessage.FETCH, 'New OTP')
  @Get('/')
  async getNewOtp(@Query() params: GetNewOtpParamsDto) {
    // if (params.type === 'web') {
    //   return await this.otpService.sendOtpOnMail(params.type, params.email);
    // }
    return null;
  }

  @ApiTags('otp')
  @ResponseMessage(SuccessMessage.VERIFY, 'OTP')
  @Post('/')
  async verifyOtp(@Body() otp: RecievedOtpDto) {
    // return await this.otpService.verifyOtp(otp);
  }

  @ApiTags('otp-config')
  @ResponseMessage(SuccessMessage.FETCH, 'OTP Configurations')
  @Get('/config')
  async getAllOtpConfig() {
    return await this.otpConfigService.getAllOtpConfig();
  }

  @ApiTags('otp-config')
  @ResponseMessage(SuccessMessage.CREATE, 'OTP Configurations')
  @Post('/config')
  async addOtpConfig(@Body() data: OtpConfigurationDto) {
    return await this.otpConfigService.addOtpConfig(data);
  }

  @ApiTags('otp-config')
  @ResponseMessage(SuccessMessage.FETCH, 'OTP Configurations')
  @Get('/config/:id')
  async getById(@Param('id') id: number) {
    return await this.otpConfigService.getOtpConfigById(id);
  }

  @ApiTags('otp-config')
  @ResponseMessage(SuccessMessage.UPDATE, 'OTP configurations')
  @Put('/config/:id')
  async updateOtpConfig(
    @Param('id') id: number,
    @Body() data: OtpConfigurationDto,
  ) {
    return await this.otpConfigService.updateOtpConfig(id, data);
  }

  @ApiTags('otp-config')
  @ResponseMessage(SuccessMessage.DELETE, 'OTP configurations')
  @Delete('/config/:id')
  async deleteOtpConfig(@Param('id') id: number) {
    return await this.otpConfigService.deleteOtpConfig(id);
  }
}
