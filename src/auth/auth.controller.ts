/* eslint-disable @typescript-eslint/no-empty-function */
/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-03 19:38:56
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-09 15:18:39
 */

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestContextProvider } from 'src/contexts/express-http.context';
import { Public } from 'src/decorators/public-route.decorator';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { FacebookOauthGuard } from 'src/guards/facebook-oauth.guard';
import { GoogleOAuthGuard } from 'src/guards/google-oauth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LoginDataDto, RegisterUserDto } from './auth.interface';
import { AuthService } from './auth.service';

@ApiTags('authentication')
@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly requestContextProvider: RequestContextProvider,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('fetch', 'user')
  @Get('/init')
  async init(@Request() req) {
    return this.requestContextProvider.get('user');
  }

  @ResponseMessage('register', 'user')
  @Post('/register')
  async register(@Body() data: RegisterUserDto) {
    return await this.authService.registerExternalUser(data);
  }

  @Public()
  @Post('/get-new-access-token')
  async getNewAccessToken(refreshToken: string) {
    return await this.authService.validateRefreshToken(refreshToken);
  }

  @Public()
  @ResponseMessage('loggedIn')
  @Post('/internal/login')
  async authenticateInternalUser(@Body() loginDataDLoginDataDto: LoginDataDto) {
    return await this.authService.findInternalUser(loginDataDLoginDataDto);
  }

  @Public()
  @ResponseMessage('loggedIn')
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
