/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-13 21:08:48
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 15:42:44
 */

import { payloadDto } from '@auth/auth.interface';
import ExternalUserService from '@core/external-users/external-users.service';
import UserService from '@core/users/users.service';
import { RequestContext } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifyCallback } from 'passport-jwt';
import StrategyConfigs from './strategy.configs';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly strategyConfigs: StrategyConfigs,
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

  async validate(payload: payloadDto, done: VerifyCallback): Promise<any> {
    const { sub, userType } = payload;
    let existingUser;
    if (userType === 'internal')
      existingUser = await this.userService.findOneByField({
        where: { userId: sub },
        select: ['userId'],
      });
    else
      existingUser = await this.externalUserService.findOneByField({
        where: { userId: sub },
        select: ['userId'],
      });

    if (!existingUser) {
      done(null, existingUser);
    } else {
      RequestContext.currentRequestContext().map.set(
        'userId',
        existingUser.userId,
      );
      existingUser.userType = userType;
      done(null, existingUser);
    }
  }
}
