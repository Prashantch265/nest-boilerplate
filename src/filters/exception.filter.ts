/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-22 22:28:27
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-26 22:42:05
 */

import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  RequestTimeoutException,
  MethodNotAllowedException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { errorResponse } from '@utils/index';
import { loggerService } from '@utils/logger';
import { TokenExpiredError } from 'jsonwebtoken';
import { DriverException as MikroOrmException } from '@mikro-orm/core';
import util from 'util';
import { InvalidFileException } from '@exceptions/invalid-file.exception';
import FileNotFoundException from '@exceptions/file-not-found.exception';
import ValidationException from '@exceptions/validation.exception';
import { RuntimeException } from '@exceptions/runtime.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: any, host: ArgumentsHost): Promise<any> {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    loggerService().error(exception.stack);

    const { message, source } = exception;
    const errorResponse: errorResponse = {
      success: false,
      message: 'Internal Server Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: undefined,
    };

    if (exception instanceof MikroOrmException) {
      errorResponse.message = 'Something Went Wrong!';
      errorResponse.status = 500;
      errorResponse.description = exception.name;
    } else if (exception instanceof UnauthorizedException) {
      errorResponse.message = exception.message;
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof ForbiddenException) {
      errorResponse.message = exception.message;
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof UnauthorizedException) {
      errorResponse.message = exception.message;
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof ForbiddenException) {
      errorResponse.message = exception.message;
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof NotFoundException) {
      errorResponse.message = exception.name;
      errorResponse.description = exception.message;
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
      errorResponse.message = exception.message;
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
    } else if (exception instanceof RuntimeException) {
      errorResponse.message = util.format(message, source);
      errorResponse.status = exception.getStatus();
    } else if (exception instanceof InvalidFileException) {
      errorResponse.status = exception.getStatus();
      errorResponse.message = exception.message;
      errorResponse.description = `Source[${exception.getSource()}] : ${exception.getDescription()}`;
    } else if (exception instanceof TokenExpiredError) {
      errorResponse.message = 'Token expired.';
      errorResponse.status = 401;
      errorResponse.description =
        'Please Login Again or get a new token from refresh token.';
    } else {
      const status: number = exception?.getStatus() || 500;
      // eslint-disable-next-line prettier/prettier
      const message: string =
        exception?.getMessage() || 'Internal Server Error';
      loggerService().error(
        `[${request.method}] ${request.path} >> StatusCode:: ${status}, Message:: ${message}, Stack::${exception.stack}`,
      );

      errorResponse.message = message;
      errorResponse.status = status;
      errorResponse.description = exception.stack;
    }

    httpAdapter.reply(ctx.getResponse(), errorResponse, errorResponse.status);
  }
}
