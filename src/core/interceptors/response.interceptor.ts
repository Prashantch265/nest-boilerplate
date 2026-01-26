import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPaginatedResponse } from '../../common/interfaces/pagination.interface';
import {
  ISuccessResponse,
  IPaginatedSuccessResponse,
} from '../../common/interfaces/response.interface';
import { Messages } from '../../common/messages';
import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements
    NestInterceptor<
      T | IPaginatedResponse<T>,
      ISuccessResponse<T> | IPaginatedSuccessResponse<T>
    >
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ISuccessResponse<T> | IPaginatedSuccessResponse<T>> {
    const message =
      this.reflector.get<string>(SUCCESS_MESSAGE_KEY, context.getHandler()) ||
      Messages.SUCCESS;

    return next.handle().pipe(
      map((data: T | IPaginatedResponse<T>) => {
        // Type guard to check for pagination
        const isPaginated = (val: unknown): val is IPaginatedResponse<T> =>
          typeof val === 'object' &&
          val !== null &&
          'items' in val &&
          'meta' in val;

        if (isPaginated(data)) {
          return {
            success: true,
            message,
            data: data.items,
            meta: data.meta,
          } as IPaginatedSuccessResponse<T>;
        }

        return {
          success: true,
          message,
          data,
        } as ISuccessResponse<T>;
      }),
    );
  }
}
