/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-03 18:39:45
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 11:16:52
 */

import { Module } from '@nestjs/common';
import UserController from './users.controller';
import User from './users.entity';
import UserService from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export default class UserModule {}
