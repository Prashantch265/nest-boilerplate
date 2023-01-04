/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:19:14
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-31 17:45:06
 */

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import ScreenController from './screen.controller';
import Screen from './screen.entity';
import ScreenService from './screen.service';

@Module({
  imports: [MikroOrmModule.forFeature([Screen])],
  controllers: [ScreenController],
  providers: [ScreenService],
  exports: [ScreenService],
})
export default class ScreenModule {}
