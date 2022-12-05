/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-13 21:20:20
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 15:02:35
 */

import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import JwtStrategy from 'src/strategies/jwt.strategy';
import UserModule from 'src/core/users/users.module';
import ExternalUsersModule from 'src/core/external-users/external-users.module';
import StrategyConfigs from 'src/strategies/strategy.configs';
import GoogleOauthStrategy from 'src/strategies/google.strategy';

@Module({
  imports: [
    UserModule,
    ExternalUsersModule,
    ConfigModule,
    JwtModule.register({
      signOptions: { algorithm: 'HS256' },
      verifyOptions: { algorithms: ['HS256'] },
    }),
  ],
  providers: [AuthService, StrategyConfigs, JwtStrategy, GoogleOauthStrategy],
  controllers: [AuthController],
  exports: [],
})
export default class AuthModule {}
