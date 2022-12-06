/* eslint-disable @typescript-eslint/no-empty-function */
/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-03 19:38:56
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 22:48:30
 */

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestContextProvider } from 'src/contexts/express-http.context';
import { Public } from 'src/decorators/public-route.decorator';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { GoogleOAuthGuard } from 'src/guards/google-oauth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LoginData } from './auth.interface';
import { AuthService } from './auth.service';

@ApiTags('authentication')
@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly requestContextProvider: RequestContextProvider,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/init')
  async init(@Request() req) {
    console.log(this.requestContextProvider.get('user'));
  }

  @Public()
  @Post('/get-new-access-token')
  async getNewAccessToken(refreshToken: string) {
    return await this.authService.validateRefreshToken(refreshToken);
  }

  @Public()
  @ResponseMessage('loggedIn')
  @Post('/internal/login')
  async authenticateInternalUser(@Body() loginData: LoginData) {
    return await this.authService.findInternalUser(loginData);
  }

  @Public()
  @ResponseMessage('loggedIn')
  @Post('/external/login')
  async authenticateExternalUser(@Body() loginData: LoginData) {
    return await this.authService.findExternalUser(loginData);
  }

  @Get('/login/facebook')
  async loginWithFacebook(@Request() req) {}

  @ResponseMessage('loggedIn')
  @Get('/facebook/cb')
  async facebookOauthRedirect(@Request() req) {
    const { user } = req;
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
