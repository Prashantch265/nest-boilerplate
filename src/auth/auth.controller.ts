/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-03 19:38:56
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-12-03 19:38:56
 */

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { LoginData } from './auth.interface';
import { AuthService } from './auth.service';

@ApiTags('authentication')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/init')
  async init() {}

  @Post('/get-new-access-token')
  async getNewAccessToken(refreshToken: string) {
    return await this.authService.validateRefreshToken(refreshToken);
  }

  @ResponseMessage('loggedIn')
  @Post('/internal/login')
  async authenticateInternalUser(@Body() loginData: LoginData) {
    return await this.authService.findInternalUser(loginData);
  }

  @ResponseMessage('loggedIn')
  @Post('/external/login')
  async authenticateExternalUser(@Body() loginData: LoginData) {
    return await this.authService.findExternalUser(loginData);
  }

  @Get('/login/facebook')
  async loginWithFacebook() {}

  @Get('/login/google')
  async loginWithGoogle() {}
}
