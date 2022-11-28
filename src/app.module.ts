/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 10:53:47
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-22 22:55:35
 */

import {
  Module,
  Logger,
  CacheModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  mongooseConnection,
  pgConnectionForMikroOrm,
  pgConnectionForTypeOrm,
} from './config/db-connection.configs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';
import { importClassesFromDirectories } from './utils/file-to-class-converter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from './filters/exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { NestModule } from '@nestjs/common';
import { HttpContextMiddleware } from './contexts/express-http.context';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import ContextModule from './contexts/context.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: 0 }),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        mongooseConnection(configService),
    }),
    TypeOrmModule.forRoot({
      ...pgConnectionForTypeOrm(),
      retryAttempts: 5,
    }),
    // MikroOrmModule.forRoot({
    //   ...pgConnectionForMikroOrm(),
    // }),
    ContextModule,
    ...importClassesFromDirectories(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpContextMiddleware).forRoutes('*');
  }
}
