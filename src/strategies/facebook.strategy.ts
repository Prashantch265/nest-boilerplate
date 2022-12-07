import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import StrategyConfigs from './strategy.configs';

@Injectable()
export default class FacebookOauthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly strategyConfigs: StrategyConfigs) {
    const googleOauthConfig = strategyConfigs.getFacebookStrategyConfig();
    super({
      clientID: googleOauthConfig.appId,
      clientSecret: googleOauthConfig.appSecret,
      callbackURL: 'http://localhost:3000/auth/facebook/cb',
      profileFields: ['id', 'displayName', 'photos', 'emails'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, emails, displayName, photos, provider, _json } = profile;

    const user = {
      sub: id,
      userName: displayName,
      email: emails[0].value,
      firstName: _json.name.split(' ')[0],
      lastName: _json.name.split(' ')[1],
      picture: photos[0].value,
      provider: provider,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
