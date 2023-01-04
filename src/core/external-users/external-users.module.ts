/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:18:49
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-12-26 00:18:49
 */

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import ExternalUserController from './external-users.controller';
import ExternalUser from './external-users.entity';
import ExternalUserService from './external-users.service';

@Module({
  imports: [MikroOrmModule.forFeature([ExternalUser])],
  controllers: [ExternalUserController],
  providers: [ExternalUserService],
  exports: [ExternalUserService],
})
export default class ExternalUsersModule {}
