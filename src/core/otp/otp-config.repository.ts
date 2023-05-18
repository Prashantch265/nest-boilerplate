/*
 * @Author: prashant.chaudhary
 * @Date: 2023-05-12 14:56:46
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 14:57:26
 */

import { FindOneOptions, Repository } from 'typeorm';
import OTP from './otp.entity';

export default class OtpConfigRepository extends Repository<OTP> {
  async findOneByField(options: FindOneOptions) {
    const { where } = options;
    options.where = { ...where, isActive: true };
    return super.findOne(options);
  }
}
