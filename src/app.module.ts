import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from './configs/configuration.module';
import { typeOrmConnectionOptions } from './configs/database/datasource';
import { ContextModule } from './core/context/context.module';
import { CookieModule } from './core/cookies/cookie.module';
import { AllExceptionsFilter } from './core/filters/exception.filter';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { LoggerModule } from './core/logging/logger.module';
import { AuthorizationModule } from './core/rbac/rbac.module';
import { CustomServeStaticModule } from './core/static/serve-static.module';
import { StorageModule } from './core/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/users/admin/admin.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [
    // Core Modules
    AuthorizationModule,
    ConfigurationModule,
    ContextModule,
    CookieModule,
    CustomServeStaticModule,
    EventEmitterModule.forRoot(),
    LoggerModule,
    StorageModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConnectionOptions()),

    // Feature Modules
    AdminModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
