/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:40:53
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 15:02:44
 */

import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { Injectable } from '@nestjs/common';
import OTP from './otp.entity';
import { OtpConfigurationDto } from './otp.dto';
import OtpConfigRepository from './otp-config.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class OtpConfigService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpConfigRepository: OtpConfigRepository,
  ) {}

  async addOtpConfig(data: OtpConfigurationDto) {
    const duplicateData = await this.otpConfigRepository.findOneByField({
      where: { type: data.type },
    });
    if (duplicateData)
      throw new RuntimeException(
        400,
        ErrorMessage.DUPLICATE_DATA,
        'otp-configuration',
      );
    return await this.otpConfigRepository.save(data);
  }

  async updateOtpConfig(id: number, data: OtpConfigurationDto) {
    const existingData = await this.otpConfigRepository.findOneByField({
      where: { id: id },
    });
    if (!existingData)
      throw new RuntimeException(
        400,
        ErrorMessage.NOT_FOUND,
        'otp-configuration',
      );
    const updatedData: OTP = {
      ...existingData,
      ...data,
    };
    await this.otpConfigRepository.save(updatedData);
    return updatedData;
  }

  async getAllOtpConfig() {
    const resData = await this.otpConfigRepository.find({
      select: [
        'id',
        'type',
        'alphabets',
        'digits',
        'specialChar',
        'expirationTime',
      ],
      where: { isActive: true },
    });
    return resData;
  }

  async getOtpConfigById(id: number) {
    const existingData = await this.otpConfigRepository.findOneByField({
      where: { id: id },
      select: [
        'id',
        'type',
        'alphabets',
        'digits',
        'specialChar',
        'expirationTime',
      ],
    });
    if (!existingData)
      throw new RuntimeException(
        400,
        ErrorMessage.NOT_FOUND,
        'otp-configuration',
      );
    return existingData;
  }

  async deleteOtpConfig(id: number) {
    const existingData = await this.otpConfigRepository.findOneByField({
      where: { id: id },
    });
    if (!existingData)
      throw new RuntimeException(
        400,
        ErrorMessage.NOT_FOUND,
        'otp-configuration',
      );
    if (existingData.isPermanent === true)
      throw new RuntimeException(
        400,
        ErrorMessage.PERMANENT_DATA,
        'otp-configuration',
      );
    await this.otpConfigRepository.delete({ id: id });
    return id;
  }
}
