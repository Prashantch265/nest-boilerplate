/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:40:53
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:45:52
 */

import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { FindOneOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import OTP from './otp.entity';
import { OtpConfigurationDto } from './otp.dto';

@Injectable()
export default class OtpConfigService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: EntityRepository<OTP>,
  ) {}

  async findOneByField(where = {}, findOptions: FindOneOptions<OTP> = {}) {
    where = { ...where, isActive: true };
    return this.otpRepository.findOne(where, findOptions);
  }

  async addOtpConfig(data: OtpConfigurationDto) {
    const duplicateData = await this.findOneByField({ type: data.type });
    if (duplicateData)
      throw new RuntimeException(
        400,
        ErrorMessage.DUPLICATE_DATA,
        'otp-configuration',
      );
    const otp: OTP = this.otpRepository.create({ ...data, ...OTP });
    await this.otpRepository.persistAndFlush(otp);
    return otp;
  }

  async updateOtpConfig(id: number, data: OtpConfigurationDto) {
    const existingData = await this.findOneByField({ id: id });
    if (!existingData)
      throw new RuntimeException(
        400,
        ErrorMessage.NOT_FOUND,
        'otp-configuration',
      );
    const updatedData: OTP = this.otpRepository.assign(existingData, data);
    await this.otpRepository.persistAndFlush(updatedData);
    return updatedData;
  }

  async getAllOtpConfig() {
    const resData = await this.otpRepository.findAll({
      fields: [
        'id',
        'type',
        'alphabets',
        'digits',
        'specialChar',
        'expirationTime',
      ],
      filters: { isActive: true },
    });
    return resData;
  }

  async getOtpConfigById(id: number) {
    const existingData = await this.findOneByField(
      { id: id },
      {
        fields: [
          'id',
          'type',
          'alphabets',
          'digits',
          'specialChar',
          'expirationTime',
        ],
      },
    );
    if (!existingData)
      throw new RuntimeException(
        400,
        ErrorMessage.NOT_FOUND,
        'otp-configuration',
      );
    return existingData;
  }

  async deleteOtpConfig(id: number) {
    const existingData = await this.findOneByField({ id: id });
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
    await this.otpRepository.nativeDelete({ id: id });
    return id;
  }
}
