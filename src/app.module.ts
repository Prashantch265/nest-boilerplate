/*
 * @Author: prashant.chaudhary 
 * @Date: 2022-10-20 10:53:47 
 * @Last Modified by:   prashant.chaudhary 
 * @Last Modified time: 2022-10-20 10:53:47 
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
