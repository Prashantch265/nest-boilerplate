/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-21 18:20:42
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-11-21 18:20:42
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { successResponse } from 'src/utils';
import successMsg from '../utils/messages/message.json';
import util from 'util';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const message = this.reflector.get<string>('message', context.getHandler());
    const source = this.reflector.get<string>('source', context.getHandler());
    return next.handle().pipe(
      map((data) => {
        let success: successResponse;
        success.source = source;
        success.data = data;
        success.message = util.format(successMsg[message], source);
        success.status = 200;
        return success;
      }),
    );
  }
}
