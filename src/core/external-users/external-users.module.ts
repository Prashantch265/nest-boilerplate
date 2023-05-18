/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:18:49
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 11:16:22
 */

import { Module } from '@nestjs/common';
import ExternalUserController from './external-users.controller';
import ExternalUser from './external-users.entity';
import ExternalUserService from './external-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalUser])],
  controllers: [ExternalUserController],
  providers: [ExternalUserService],
  exports: [ExternalUserService],
})
export default class ExternalUsersModule {}
