/*
 * @Author: prashant.chaudhary
 * @Date: 2023-05-12 11:30:20
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 11:35:45
 */

import { FindOneOptions, Repository } from 'typeorm';
import ExternalUser from './external-users.entity';

export default class ExternalUserRepository extends Repository<ExternalUser> {
  async findOneByField(options: FindOneOptions) {
    const { where } = options;
    options.where = { ...where, isActive: true };
    return super.findOne(options);
  }
}
