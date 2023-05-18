/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 10:53:47
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 10:53:15
 */

import AuthModule from '@auth/auth.module';
import { ConfigurationModule } from '@config/configuration.module';
import {
  pgConnectionForMikroOrm,
  pgConnectionForTypeOrm,
} from '@config/db-connection.configs';
import { HttpExceptionFilter } from '@filters/exception.filter';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import NodeMailerModule from '@mailer/mailer.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { importClassesFromDirectories } from '@utils/file-to-class-converter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: 0 }),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ConfigurationModule,
    /**
     * Mongoose Connection
     */
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) =>
    //     mongooseConnection(configService),
    // }),

    /**
     * TypeOrm Connection
     */
    TypeOrmModule.forRoot({
      ...pgConnectionForTypeOrm(),
      retryAttempts: 5,
      autoLoadEntities: true,
    }),

    /**
     * MikroOrm Connection
     */
    // MikroOrmModule.forRoot({
    //   ...pgConnectionForMikroOrm(),
    //   logger: loggerService,
    // }),

    NodeMailerModule,
    // ...importClassesFromDirectories(),
    AuthModule,
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
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
