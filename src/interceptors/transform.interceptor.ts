/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-21 18:20:42
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 17:12:04
 */

import { SuccessMessage } from '@core/Common/interfaces/common.interface';
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
        const success: successResponse = {
          success: true,
          source: source,
          data: data,
          message: util.format(message, source),
          status: 200,
        };
        return success;
      }),
    );
  }
}
