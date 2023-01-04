/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-05 15:01:07
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 15:08:29
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      /**
       * we specify accessType to be offline so that Google can return a refresh token after successful authentication.
       */
      accessType: 'offline',
    });
  }
}
