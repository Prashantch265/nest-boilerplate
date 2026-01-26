import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_ROUTE } from '../decorators/public-route.decorator';
import { User } from '../../modules/users/users.entity';
import { ContextService } from '../context/context.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService, // Inject the service
  ) {
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

  /**
   * This method is called by Passport after the user is successfully authenticated.
   * We override it to store the user in our request-scoped context (CLS).
   */
  handleRequest<TUser = User>(err: any, user: TUser, info: any): TUser {
    if (err || !user) {
      // If authentication fails, Passport throws an error. We re-throw it.
      throw err || info;
    }

    // If authentication succeeds, store the user in our ContextService.
    this.contextService.currentUser = user as unknown as User;

    // Return the user so it's still available on req.user if needed.
    return user;
  }
}
