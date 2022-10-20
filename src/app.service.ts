/*
 * @Author: prashant.chaudhary 
 * @Date: 2022-10-20 10:53:37 
 * @Last Modified by:   prashant.chaudhary 
 * @Last Modified time: 2022-10-20 10:53:37 
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
