/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 09:50:18
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 15:05:00
 */

import { IS_PUBLIC_ROUTE } from '@decorators/public-route.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}