/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-05 14:43:26
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-04-29 21:43:54
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import StrategyConfigs from './strategy.configs';
@Injectable()
export default class GoogleOauthStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(private readonly strategyConfigs: StrategyConfigs) {
    const googleOauthConfig = strategyConfigs.getGoogleStrategyConfig();
    super({
      clientID: googleOauthConfig.clientId,
      clientSecret: googleOauthConfig.clientSecret,
      callbackURL: 'http://localhost:3000/auth/google/cb',
      scope: ['email', 'profile'],
    });
  }

  /**
   * The validate method executes after Google returns the requested user information.
   * In this method, you decide what to do with the user information returned by Google.
   * You then return the result using the done method.
   * @param accessToken
   * @param refreshToken
   * @param profile
   * @param done
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos, displayName, provider } = profile;

    const user = {
      sub: id,
      email: emails[0].value,
      userName: displayName,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      provider: provider,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
