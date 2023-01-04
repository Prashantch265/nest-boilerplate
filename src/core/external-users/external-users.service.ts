/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:17:39
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:47:33
 */

import { RegisterUserDto } from '@auth/auth.interface';
import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { FindOneOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import ExternalUser from './external-users.entity';
import { externalUserDto } from './external-users.dto';

@Injectable()
export default class ExternalUserService {
  constructor(
    /**
     * InjectRepository
     * We can create repository with @InjectRepository() or by extendidng EntityRepository also known as Cutsom Repository.
     */
    @InjectRepository(ExternalUser)
    private readonly externalUserRepository: EntityRepository<ExternalUser>,
  ) {}

  async findOneByField(
    where = {},
    findOptions: FindOneOptions<ExternalUser> = {},
  ) {
    where = { ...where, isActive: true };
    return this.externalUserRepository.findOne(where, findOptions);
  }

  async saveUserFromSignUp(user: RegisterUserDto) {
    const externalUser: ExternalUser = this.externalUserRepository.create({
      ...ExternalUser,
      ...user,
    });
    await this.externalUserRepository.persistAndFlush(externalUser);
    return externalUser;
  }

  async saveUserFromOauth(user: any) {
    const userData: ExternalUser = this.externalUserRepository.create({
      ...ExternalUser,
      ...user,
    });
    userData.userName = user.userName;
    userData.firstName = user.firstName;
    userData.lastName = user.lastName;
    userData.sub = user.sub;
    userData.provider = user.provider;
    userData.email = user.email;
    userData.profilePic = user.picture;
    userData.accessToken = user.accessToken;
    userData.refreshToken = user.refreshToken;
    await this.externalUserRepository.persistAndFlush(userData);
    return userData;
  }

  async update(user: externalUserDto | any, where = {}) {
    const existingUser = await this.findOneByField({ where });
    if (!existingUser)
      throw new RuntimeException(400, ErrorMessage.NOT_FOUND, 'user');
    const updatedUser: ExternalUser = this.externalUserRepository.assign(
      existingUser,
      user,
    );
    await this.externalUserRepository.persistAndFlush(updatedUser);
    return updatedUser;
  }
}
