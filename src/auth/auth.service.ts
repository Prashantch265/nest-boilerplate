/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-13 21:18:42
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-06 15:06:06
 */

import { Injectable } from '@nestjs/common';
import ExternalUserService from 'src/core/external-users/external-users.service';
import UserService from 'src/core/users/users.service';
import { RuntimeException } from 'src/exceptions/runtime.exception';
import { OauthUser, LoginData, payload, userType } from './auth.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { loggerService } from 'src/utils/logger';
import { AuthorizationException } from 'src/exceptions/unauthorized.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly externalUserService: ExternalUserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly jwtConfig = this.configService.get('jwt');

  async findInternalUser(loginData: LoginData) {
    const { userName, email, password } = loginData;
    const condition = userName ? { userName: userName } : { email: email };
    const existingUser = await this.userService.findOneByField(condition);
    if (!existingUser) throw new RuntimeException(400, 'invalidCredential');

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) throw new RuntimeException(400, 'invalidCredential');

    const payload: payload = {
      sub: existingUser.userId,
      userType: userType.INTERNAL,
      iat: Date.now(),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.accessTokenExpiresIn,
      secret: this.jwtConfig.accessTokenSecret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.refreshTokenExpiresIn,
      secret: this.jwtConfig.refreshTokenSecret,
    });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async findExternalUser(loginData: LoginData) {
    const { userName, email, password } = loginData;
    const condition = userName ? { userName: userName } : { email: email };
    const existingUser = await this.externalUserService.findOneByField(
      condition,
    );
    if (!existingUser) throw new RuntimeException(400, 'invalidCredential');

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) throw new RuntimeException(400, 'invalidCredential');

    const payload: payload = {
      sub: existingUser.userId,
      userType: userType.EXTERNAL,
      iat: Date.now(),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.accessTokenExpiresIn,
      secret: this.jwtConfig.accessTokenSecret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.refreshTokenExpiresIn,
      secret: this.jwtConfig.refreshTokenSecret,
    });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      let payload: payload = this.jwtService.verify(refreshToken, {
        secret: this.jwtConfig.refreshTokenSecret,
      });

      const { sub, userType } = payload;

      let existingUser;

      if (userType === 'internal') {
        existingUser = await this.userService.findOneByField({
          userId: sub,
        });
      } else {
        existingUser = await this.externalUserService.findOneByField({
          userId: sub,
        });
      }

      if (!existingUser) throw new AuthorizationException(401, 'invalidToken');

      payload = {
        sub: existingUser.userId,
        userType: userType,
        iat: Date.now(),
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.jwtConfig.accessTokenExpiresIn,
        secret: this.jwtConfig.accessTokenSecret,
      });

      refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.jwtConfig.refreshTokenExpiresIn,
        secret: this.jwtConfig.refreshTokenSecret,
      });

      return { accessToken: accessToken, refreshToken: refreshToken };
    } catch (err) {
      loggerService().error(err);
      throw new RuntimeException(401, 'invalidToken');
    }
  }

  async saveUserFromGoogle(user: OauthUser) {
    let existingUser = await this.externalUserService.findOneByField({
      sub: user.sub,
    });

    if (!existingUser) {
      existingUser = await this.externalUserService.saveUserFromOauth(user);
    }

    const payload: payload = {
      sub: existingUser.userId,
      userType: userType.EXTERNAL,
      iat: Date.now(),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.accessTokenExpiresIn,
      secret: this.jwtConfig.accessTokenSecret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.refreshTokenExpiresIn,
      secret: this.jwtConfig.refreshTokenSecret,
    });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async saveUserFromFacebook(user: OauthUser) {
    let existingUser = await this.externalUserService.findOneByField({
      sub: user.sub,
    });

    if (!existingUser) {
      existingUser = await this.externalUserService.saveUserFromOauth(user);
    }

    const payload: payload = {
      sub: existingUser.userId,
      userType: userType.EXTERNAL,
      iat: Date.now(),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.accessTokenExpiresIn,
      secret: this.jwtConfig.accessTokenSecret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.refreshTokenExpiresIn,
      secret: this.jwtConfig.refreshTokenSecret,
    });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
