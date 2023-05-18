/*
 * @Author: prashant.chaudhary
 * @Date: 2023-01-02 12:08:06
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 15:37:05
 */

import { Injectable } from '@nestjs/common';
import { CreateUsersDto, UpdateUsersDto } from './users.dto';
import User from './users.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import UserRepository from './users.repository';
import { FindOneOptions } from 'typeorm';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateUsersDto) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const internalUser = await this.userRepository.save(data);
    delete internalUser.password;
    return internalUser;
  }

  async update(userId: string, data: UpdateUsersDto) {}

  async getAll() {
    return await this.userRepository.find({
      select: [
        'userId',
        'userName',
        'fullName',
        'contact',
        'email',
        'profilePic',
      ],
      where: { isActive: true },
    });
  }

  async findOneByField(options: FindOneOptions) {
    return await this.userRepository.findOneByField(options);
  }
}
