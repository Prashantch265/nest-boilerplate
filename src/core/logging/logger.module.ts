import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonLoggerService } from './service/winston-logger.service';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .exclude(
        {
          path: '/',
          method: RequestMethod.GET,
        },
        {
          path: 'metrics',
          method: RequestMethod.GET,
        },
        {
          path: 'health',
          method: RequestMethod.GET,
        },
      )
      .forRoutes({ path: '', method: RequestMethod.ALL });
  }
}
