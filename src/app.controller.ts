/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 10:53:56
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-10-20 10:53:56
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseMessage } from './decorators/response.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ResponseMessage('fetch', ['test'])
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
