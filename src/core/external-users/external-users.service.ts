/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:17:39
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 14:43:35
 */

import { RegisterUserDto } from '@auth/auth.interface';
import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { Injectable } from '@nestjs/common';
import ExternalUser from './external-users.entity';
import { externalUserDto } from './external-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import ExternalUserRepository from './external-users.repository';
import { FindOneOptions } from 'typeorm';

@Injectable()
export default class ExternalUserService {
  constructor(
    @InjectRepository(ExternalUser)
    private readonly externalUserRepository: ExternalUserRepository,
  ) {}

  async saveUserFromSignUp(user: RegisterUserDto) {
    return await this.externalUserRepository.save(user);
  }

  async saveUserFromOauth(user: any) {
    await this.externalUserRepository.save(user);
    return user;
  }

  async update(user: externalUserDto | any, where = {}) {
    const existingUser = await this.externalUserRepository.findOneByField({
      where,
    });
    if (!existingUser)
      throw new RuntimeException(400, ErrorMessage.NOT_FOUND, 'user');
    const updatedUser: ExternalUser = { ...existingUser, ...user };
    await this.externalUserRepository.save(updatedUser);
    return updatedUser;
  }

  async findOneByField(options: FindOneOptions) {
    return await this.externalUserRepository.findOneByField(options);
  }
}
