/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-03 18:39:45
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-26 00:18:20
 */

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import UserController from './users.controller';
import User from './users.entity';
import UserService from './users.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export default class UserModule {}
