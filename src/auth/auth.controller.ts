/* eslint-disable @typescript-eslint/no-empty-function */
/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-03 19:38:56
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-02 11:58:53
 */

import { UserRoleService } from '@core/authorization/user-role/user-role.service';
import { SuccessMessage } from '@core/Common/interfaces/common.interface';
import { Public } from '@decorators/public-route.decorator';
import { ResponseMessage } from '@decorators/response.decorator';
import { FacebookOauthGuard } from '@guards/facebook-oauth.guard';
import { GoogleOAuthGuard } from '@guards/google-oauth.guard';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUserDto, LoginDataDto } from './auth.interface';
import { AuthService } from './auth.service';

@ApiTags('authentication')
@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRoleService: UserRoleService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage(SuccessMessage.FETCH, 'permissions')
  @Get('/init')
  async init(@Request() req) {
    console.log(req);
    const { userId, userType } = req.user;
    return await this.userRoleService.getPermissionsForUser(userId, userType);
  }

  @ResponseMessage(SuccessMessage.REGISTER, 'user')
  @Post('/register')
  async register(@Body() data: RegisterUserDto) {
    return await this.authService.registerExternalUser(data);
  }

  @Public()
  @ResponseMessage(SuccessMessage.REFRESH, 'access-token')
  @Post('/get-new-access-token')
  async getNewAccessToken(refreshToken: string) {
    return await this.authService.validateRefreshToken(refreshToken);
  }

  @Public()
  @ResponseMessage(SuccessMessage.LOGGED_IN)
  @Post('/internal/login')
  async authenticateInternalUser(@Body() loginDataDLoginDataDto: LoginDataDto) {
    return await this.authService.findInternalUser(loginDataDLoginDataDto);
  }

  @Public()
  @ResponseMessage(SuccessMessage.LOGGED_IN)
  @Post('/external/login')
  async authenticateExternalUser(@Body() loginDataDLoginDataDto: LoginDataDto) {
    return await this.authService.findExternalUser(loginDataDLoginDataDto);
  }

  @UseGuards(FacebookOauthGuard)
  @Get('/login/facebook')
  async loginWithFacebook(@Request() req) {}

  @ResponseMessage('loggedIn')
  @UseGuards(FacebookOauthGuard)
  @Get('/facebook/cb')
  async facebookOauthRedirect(@Request() req) {
    const { user } = req;
    console.log(user);
    return await this.authService.saveUserFromFacebook(user);
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('/login/google')
  async loginWithGoogle(@Request() req) {}

  @ResponseMessage('loggedIn')
  @UseGuards(GoogleOAuthGuard)
  @Get('/google/cb')
  async googleOauthRedirect(@Request() req) {
    const { user } = req;
    console.log(user);
    return await this.authService.saveUserFromGoogle(user);
  }
}
