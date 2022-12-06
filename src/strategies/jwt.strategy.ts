/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-13 21:08:48
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 15:36:09
 */

import { ExtractJwt, Strategy, VerifyCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import StrategyConfigs from './strategy.configs';
import { payload } from 'src/auth/auth.interface';
import { RequestContextProvider } from 'src/contexts/express-http.context';
import UserService from 'src/core/users/users.service';
import ExternalUserService from 'src/core/external-users/external-users.service';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly strategyConfigs: StrategyConfigs,
    private readonly requestContextProviders: RequestContextProvider,
    private readonly userService: UserService,
    private readonly externalUserService: ExternalUserService,
  ) {
    const jwtConfig = strategyConfigs.getJwtConfig();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.accessTokenSecret,
      algorithms: 'HS256',
    });
  }

  async validate(payload: payload, done: VerifyCallback): Promise<any> {
    const { sub, userType } = payload;
    let existingUser;
    if (userType === 'internal')
      existingUser = await this.userService.findOneByField({ userId: sub });
    else
      existingUser = await this.externalUserService.findOneByField({
        userId: sub,
      });

    if (!existingUser) {
      done(null, existingUser);
    } else {
      await this.requestContextProviders.set('user', existingUser);
      done(null, existingUser);
    }
  }
}
