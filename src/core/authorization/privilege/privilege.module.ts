/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:19:32
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 22:35:52
 */

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import PrivilegeController from './privilege.controller';
import Privilege from './privilege.entity';
import PrivilegeService from './privilege.service';

@Module({
  imports: [MikroOrmModule.forFeature([Privilege])],
  controllers: [PrivilegeController],
  providers: [PrivilegeService],
  exports: [PrivilegeService],
})
export default class PrivilegeModule {}
