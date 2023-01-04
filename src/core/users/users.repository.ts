/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:35:54
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-25 23:47:28
 */

import { FindOneOptions } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import User from './users.entity';

/**
 * Custom Repository
 * It's not mandatory to use custom repository. But if you want to use it. Here's the example of it.
 * Now go back to your entity add this repository into customRepository Callback
 */
export default class UserRepository extends EntityRepository<User> {
  async findOneByField(where = {}, findOptions: FindOneOptions<User> = {}) {
    where = { ...where, isActive: true };
    return this.findOne(where, findOptions);
  }
}
