import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../modules/users/users.entity';
import { ContextService } from '../context/context.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions are required for this route, allow access.
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const user: User = this.contextService.currentUser;

    // Flatten all permissions from all roles the user has into a single set for efficient lookup.
    const userPermissions = new Set(
      user.roles?.flatMap((role) => role.permissions.map((p) => p.code)) ?? [],
    );

    // Check if the user has every required permission.
    return requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );
  }
}
