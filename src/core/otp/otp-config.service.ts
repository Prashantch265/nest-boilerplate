/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:40:53
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-16 20:54:47
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RuntimeException } from 'src/exceptions/runtime.exception';
import { Repository } from 'typeorm';
import OTP from './otp.entity';
import { OtpConfiguration } from './otp.interface';

@Injectable()
export default class OtpConfigService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
  ) {}

  async findOneByField(where = {}, relations = []) {
    where = { ...where, isDeleted: false, isActive: true };
    return this.otpRepository.findOne({ where, relations });
  }

  async addOtpConfig(data: OtpConfiguration) {
    const duplicateData = await this.findOneByField({ type: data.type });
    if (duplicateData)
      throw new RuntimeException(400, 'duplicateData', 'otp-configuration');
    const resData = await this.otpRepository.save(data);
    return resData;
  }

  async updateOtpConfig(id: number, data: OtpConfiguration) {
    const existingData = await this.findOneByField({ id: id });
    if (!existingData)
      throw new RuntimeException(400, 'notFound', 'otp-configuration');
    const updatedData = { ...existingData, ...data };
    const resData = await this.otpRepository.save(updatedData);
    return resData;
  }

  async getAllOtpConfig() {
    const resData = await this.otpRepository.find({
      select: ['id', 'type', 'otpLength', 'expirationTime'],
      where: { isActive: true, isDeleted: false },
    });
    return resData;
  }

  async getOtpConfigById(id: number) {
    const existingData = await this.findOneByField({ id: id });
    if (!existingData)
      throw new RuntimeException(400, 'notFount', 'otp-configuration');
    const resData = await this.findOneByField({ id: id });
    return resData;
  }

  async deleteOtpConfig(id: number) {
    const existingData = await this.findOneByField({ id: id });
    if (!existingData)
      throw new RuntimeException(400, 'notFount', 'otp-configuration');
    if (existingData.isPermanent === true)
      throw new RuntimeException(400, 'permanentData', 'otp-configuration');
    await this.otpRepository.update(
      { isActive: false, isDeleted: true },
      { isPermanent: false },
    );
    return id;
  }
}
