/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 11:29:25
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-16 09:51:57
 */

import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthorizationException extends HttpException {
  private readonly source: string | string[];
  constructor(
    status: HttpStatus.UNAUTHORIZED | HttpStatus.FORBIDDEN,
    response: string,
    source?: string | string[],
  ) {
    super(response, status);
    this.source = source;
  }
}
