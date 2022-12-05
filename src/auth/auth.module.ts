/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-13 21:20:20
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-03 19:01:08
 */

import { Module } from '@nestjs/common';
import ExternalUser from 'src/core/external-users/external-users.entity';
import UserService from 'src/core/users/users.service';
import AuthController from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserService,
    ExternalUser,
    ConfigModule,
    JwtModule.register({
      signOptions: { algorithm: 'HS256' },
      verifyOptions: { algorithms: ['HS256'] },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
