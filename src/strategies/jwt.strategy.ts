/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-13 21:08:48
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 15:36:09
 */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import StrategyConfigs from './strategy.configs';
import { payload } from 'src/auth/auth.interface';
import { RequestContextProvider } from 'src/contexts/express-http.context';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly strategyConfigs: StrategyConfigs,
    private readonly requestContextProviders: RequestContextProvider,
  ) {
    const jwtConfig = strategyConfigs.getJwtConfig();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.accessTokenSecret,
    });
  }

  async validate(payload: payload) {
    const user = { userId: payload.sub, userType: payload.userType };
    this.requestContextProviders.set('user', user);
    return;
  }
}
