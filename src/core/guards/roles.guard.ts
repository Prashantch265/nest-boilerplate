import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_TYPE } from '../../common/enums/users.enum';
import { User } from '../../modules/users/users.entity';
import { ContextService } from '../context/context.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<USER_TYPE[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required for this route, allow access.
    if (!requiredRoles) {
      return true;
    }

    const user: User = this.contextService.currentUser;

    // Check if the user's userType is included in the list of required roles.
    return requiredRoles.some((role) => user.userType === role);
  }
}
