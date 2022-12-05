/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 09:50:18
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 15:05:00
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
