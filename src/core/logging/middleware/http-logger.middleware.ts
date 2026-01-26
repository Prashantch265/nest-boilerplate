import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonLoggerService } from '../service/winston-logger.service';
import { context, trace } from '@opentelemetry/api';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const env = this.configService.get<string>('app.env') ?? 'local';
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const span = trace.getSpan(context.active());
      const spanContext = span?.spanContext();

      if (env === 'local')
        this.logger.log({
          message: `HTTP ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
        });
      else
        this.logger.log(
          {
            message: `HTTP ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
            traceId: spanContext?.traceId,
            spanId: spanContext?.spanId,
            method,
            url: originalUrl,
            statusCode,
            duration,
          },
          'HTTP',
        );
    });

    next();
  }
}
