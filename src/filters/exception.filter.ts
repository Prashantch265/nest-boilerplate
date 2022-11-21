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
import { Response } from 'express';
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
  async catch(
    exception: [
      HttpException,
      BadRequestException,
      ForbiddenException,
      MethodNotAllowedException,
      NotFoundException,
      RequestTimeoutException,
      UnauthorizedException,
      UnsupportedMediaTypeException,
    ],
    host: ArgumentsHost,
  ): Promise<any> {
    const response: Response = host.switchToHttp().getResponse();

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
    } else if (!response.headersSent) {
      response.status(errorResponse.status).json(errorResponse).send();
    }
  }
}
