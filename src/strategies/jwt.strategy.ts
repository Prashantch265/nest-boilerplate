/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-13 21:08:48
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-11-13 21:08:48
 */

import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthorizationException } from 'src/exceptions/unauthorized.exception';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
 
  async validateJwt(): Promise<any> {}
}
