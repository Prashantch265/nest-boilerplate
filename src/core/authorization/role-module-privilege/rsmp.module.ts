/*
 * @Author: prashant.chaudhary
 * @Date: 2023-01-03 22:30:47
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 22:48:10
 */

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import ModulePrivilegeModule from '../module-privilege/module-privilege.module';
import RoleModule from '../role/role.module';
import ScreenModule from '../screen/screen.module';
import RsmpController from './rsmp.controller';
import RSMP from './rsmp.entity';
import { RsmpService } from './rsmp.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([RSMP]),
    RoleModule,
    ScreenModule,
    ModulePrivilegeModule,
  ],
  controllers: [RsmpController],
  providers: [RsmpService],
  exports: [RsmpService],
})
export default class RsmpModule {}
