/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-22 22:28:27
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-11-22 22:28:27
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  ForbiddenException,
  MethodNotAllowedException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import FileNotFoundException from 'src/exceptions/file-not-found.exception';
import ValidationException from 'src/exceptions/validation.exception';
import { errorResponse } from 'src/utils';
import { loggerService } from 'src/utils/logger';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { TokenExpiredError } from 'jsonwebtoken';

@Catch(
  HttpException,
  BadRequestException,
  ForbiddenException,
  MethodNotAllowedException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
  UnsupportedMediaTypeException,
)
export class HttpExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  async catch(exception: any, host: ArgumentsHost): Promise<any> {
    const response: Response = host.switchToHttp().getResponse();
    const request: Request = host.switchToHttp().getRequest();

    loggerService().error(exception);

    let errorResponse: errorResponse;

    if (exception instanceof TypeORMError) {
      errorResponse.message = 'Something Went Wrong!';
      errorResponse.status = 500;
      errorResponse.description = exception.message;
    } else if (exception instanceof UnauthorizedException) {
      errorResponse.message = 'Unauthorized';
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof ForbiddenException) {
      errorResponse.message = 'Forbidden';
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof NotFoundException) {
      errorResponse.message = 'Route Not Found';
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof BadRequestException) {
      errorResponse.message = 'Bad Request';
      errorResponse.description = exception.message;
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof ValidationException) {
      errorResponse.message = exception.getResponse().toString();
      errorResponse.description = exception.getErrors();
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof RequestTimeoutException) {
      errorResponse.message = 'Bad Request';
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof MethodNotAllowedException) {
      errorResponse.message = 'Bad Request';
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof UnsupportedMediaTypeException) {
      errorResponse.message = 'Bad Request';
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof FileNotFoundException) {
      errorResponse.message = exception.getMessage();
      errorResponse.status = exception.getStatus();
      errorResponse.description = exception.getDescription();
    } else if (exception instanceof TokenExpiredError) {
      errorResponse.message = 'Token expired.';
      errorResponse.status = 401;
      errorResponse.description =
        'Please Login Again or get a new token from refresh token.';
    } else {
      const status: number = exception?.getStatus() || 500;
      // eslint-disable-next-line prettier/prettier
      const message: string = exception?.getMessage() || 'Internal Server Error';
      loggerService().error(
        `[${request.method}] ${request.path} >> StatusCode:: ${status}, Message:: ${message}, Stack::${exception.stack}`,
      );

      errorResponse.message = message;
      errorResponse.status = status;
      errorResponse.description = exception.stack;
    }

    if (!response.headersSent) {
      response.status(errorResponse.status).json(errorResponse).send();
    }
  }
}
