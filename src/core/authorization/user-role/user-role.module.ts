/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:19:03
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-02 00:12:53
 */

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import RoleModule from '../role/role.module';
import UserRoleController from './user-role.controller';
import UserRole from './user-role.entity';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserRole]), RoleModule],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export default class UserRoleModule {}
