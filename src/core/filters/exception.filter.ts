import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomHttpException } from '../exceptions';
import { WinstonLoggerService } from '../logging/service/winston-logger.service';

/**
 * Global Exception Filter to handle all exceptions.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let source: unknown = null;

    if (exception instanceof CustomHttpException) {
      status = exception.getStatus();
      message = exception.message;
      source = exception.source;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (
      exception instanceof Error &&
      exception.message === 'No auth token'
    ) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(
      message,
      exception instanceof Error ? exception.stack : undefined,
      'ExceptionFilter',
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      source,
      timestamp: new Date().toISOString(),
    });
  }
}
