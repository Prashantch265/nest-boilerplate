/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-13 21:20:20
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-02 16:45:19
 */

import UserRoleModule from '@core/authorization/user-role/user-role.module';
import ExternalUsersModule from '@core/external-users/external-users.module';
import OtpModule from '@core/otp/otp.module';
import UserModule from '@core/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import FacebookOauthStrategy from '@strategies/facebook.strategy';
import GoogleOauthStrategy from '@strategies/google.strategy';
import JwtStrategy from '@strategies/jwt.strategy';
import StrategyConfigs from '@strategies/strategy.configs';
import AuthController from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    ExternalUsersModule,
    ConfigModule,
    JwtModule.register({
      signOptions: { algorithm: 'HS256' },
      verifyOptions: { algorithms: ['HS256'] },
    }),
    OtpModule,
    UserRoleModule,
  ],
  providers: [
    AuthService,
    StrategyConfigs,
    JwtStrategy,
    GoogleOauthStrategy,
    FacebookOauthStrategy,
  ],
  controllers: [AuthController],
  exports: [],
})
export default class AuthModule {}
