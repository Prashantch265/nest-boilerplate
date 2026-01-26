import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('oauth.google.clientId'),
      clientSecret: configService.getOrThrow('oauth.google.clientSecret'),
      callbackURL: configService.getOrThrow('oauth.google.callback'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, name, emails, photos } = profile;

    if (!emails?.length) {
      throw new Error('Google account has no email associated');
    }

    if (!photos?.length) {
      throw new Error('Google account has no profile picture');
    }

    const user = {
      sub: id,
      email: emails[0].value,
      firstName: name?.givenName,
      middleName: name?.middleName,
      lastName: name?.familyName,
      profilePicture: photos[0].value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
