/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:19:56
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-31 17:44:47
 */

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import ScreenModule from '../screen/screen.module';
import ModulesController from './module.controller';
import ModulesEntity from './module.entity';
import ModulesService from './module.service';

@Module({
  imports: [MikroOrmModule.forFeature([ModulesEntity]), ScreenModule],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export default class ModulesModule {}
