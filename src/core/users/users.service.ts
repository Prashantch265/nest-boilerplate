/*
 * @Author: prashant.chaudhary
 * @Date: 2023-01-02 12:08:06
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 17:21:42
 */

import { FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateUsersDto, UpdateUsersDto } from './users.dto';
import User from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findOneByFeild(where = {}, options: FindOptions<User> = {}) {
    where = { ...where, isActive: true };
    return await this.userRepository.findOne(where, options);
  }

  async create(data: CreateUsersDto) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const internalUser: User = this.userRepository.create({ ...User, ...data });
    await this.userRepository.persistAndFlush(internalUser);
    delete internalUser.password;
    return internalUser;
  }

  async update(userId: string, data: UpdateUsersDto) {}

  async getAll() {
    return await this.userRepository.findAll({
      fields: [
        'userId',
        'userName',
        'fullName',
        'contact',
        'email',
        'profilePic',
      ],
      filters: { isActive: true },
    });
  }
}
