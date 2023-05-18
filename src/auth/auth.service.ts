/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-13 21:18:42
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 15:43:15
 */

import ExternalUserService from '@core/external-users/external-users.service';
import OtpService from '@core/otp/otp.service';
import UserService from '@core/users/users.service';
import { RuntimeException } from '@exceptions/runtime.exception';
import { AuthorizationException } from '@exceptions/unauthorized.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loggerService } from '@utils/logger';
import {
  RegisterUserDto,
  LoginDataDto,
  payloadDto,
  userType,
  OauthUserDto,
} from './auth.interface';
import * as bcrypt from 'bcrypt';
import { OtpType } from '@core/otp/otp.dto';
import { ErrorMessage } from '@core/Common/interfaces/common.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly externalUserService: ExternalUserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  private readonly jwtConfig = this.configService.get('jwt');

  async registerExternalUser(user: RegisterUserDto) {
    const existingUser = await this.externalUserService.findOneByField({
      where: { email: user.email, userName: user.userName },
    });
    if (existingUser)
      throw new RuntimeException(400, ErrorMessage.DUPLICATE_DATA, 'user');

    const existingUserName = await this.externalUserService.findOneByField({
      where: { userName: user.userName },
    });
    if (existingUserName)
      throw new RuntimeException(400, ErrorMessage.USERNAME_NOT_AVAILABLE);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const resData = await this.externalUserService.saveUserFromSignUp(user);
    const { email, userName } = resData;
    await this.otpService.sendOtpOnMail(OtpType.WEB, email);

    return { email: email, userName: userName };
  }

  async findInternalUser(loginData: LoginDataDto) {
    const { userName, email, password } = loginData;
    const condition = userName ? { userName: userName } : { email: email };
    const existingUser = await this.userService.findOneByField({
      where: condition,
    });
    if (!existingUser)
      throw new RuntimeException(400, ErrorMessage.INVALID_CREDENTIAL);

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch)
      throw new RuntimeException(400, ErrorMessage.INVALID_CREDENTIAL);

    const payload: payloadDto = {
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

  async findExternalUser(loginData: LoginDataDto) {
    const { userName, email, password } = loginData;
    const condition = userName ? { userName: userName } : { email: email };
    const existingUser = await this.externalUserService.findOneByField({
      where: condition,
    });
    if (!existingUser)
      throw new RuntimeException(400, ErrorMessage.INVALID_CREDENTIAL);

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch)
      throw new RuntimeException(400, ErrorMessage.INVALID_CREDENTIAL);

    const payload: payloadDto = {
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
      let payload: payloadDto = this.jwtService.verify(refreshToken, {
        secret: this.jwtConfig.refreshTokenSecret,
      });

      const { sub, userType } = payload;

      let existingUser;

      if (userType === 'internal') {
        existingUser = await this.userService.findOneByField({
          where: {
            userId: sub,
          },
          select: ['userId'],
        });
      } else {
        existingUser = await this.externalUserService.findOneByField({
          where: { userId: sub },
          select: ['userId'],
        });
      }

      if (!existingUser)
        throw new AuthorizationException(
          HttpStatus.UNAUTHORIZED,
          ErrorMessage.INVALID_TOKEN,
        );

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
      throw new RuntimeException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessage.INVALID_TOKEN,
      );
    }
  }

  async saveUserFromGoogle(user: OauthUserDto) {
    let existingUser = await this.externalUserService.findOneByField({
      where: { sub: user.sub },
    });

    if (!existingUser) {
      existingUser = await this.externalUserService.saveUserFromOauth(user);
    }

    const payload: payloadDto = {
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

  async saveUserFromFacebook(user: OauthUserDto) {
    let existingUser = await this.externalUserService.findOneByField({
      where: { sub: user.sub },
    });

    if (!existingUser) {
      existingUser = await this.externalUserService.saveUserFromOauth(user);
    }

    const payload: payloadDto = {
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
