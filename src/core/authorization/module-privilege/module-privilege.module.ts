/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-27 22:29:17
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 22:47:33
 */

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import ModulesModule from '../module/module.module';
import PrivilegeModule from '../privilege/privilege.module';
import ModulePrivilegeController from './module-privilege.controller';
import ModulePrivilege from './module-privilege.entity';
import { ModulePrivilegeService } from './module-privilege.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ModulePrivilege]),
    ModulesModule,
    PrivilegeModule,
  ],
  controllers: [ModulePrivilegeController],
  providers: [ModulePrivilegeService],
  exports: [ModulePrivilegeService],
})
export default class ModulePrivilegeModule {}
