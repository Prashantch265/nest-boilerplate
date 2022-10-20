/*
 * @Author: prashant.chaudhary 
 * @Date: 2022-10-20 10:53:56 
 * @Last Modified by:   prashant.chaudhary 
 * @Last Modified time: 2022-10-20 10:53:56 
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
