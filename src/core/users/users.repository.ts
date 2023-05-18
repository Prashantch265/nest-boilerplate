/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:35:54
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 11:19:47
 */

import User from './users.entity';
import { Repository, FindOneOptions } from 'typeorm';

export default class UserRepository extends Repository<User> {
  async findOneByField(options: FindOneOptions) {
    const { where } = options;
    options.where = { ...where, isActive: true };
    return super.findOne(options);
  }
}
