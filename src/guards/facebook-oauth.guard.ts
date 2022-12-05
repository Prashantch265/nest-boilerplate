/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-05 15:06:43
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 15:07:39
 */

import { AuthGuard } from '@nestjs/passport';

export class FacebookOauthGuard extends AuthGuard('facebook') {}
