import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { User } from '../../modules/users/users.entity';

@Injectable()
export class ContextService {
  constructor(private readonly cls: ClsService) {}

  /**
   * Gets the authenticated user from the request context.
   * Throws an error if called outside of a request context.
   */
  get currentUser(): User {
    const user = this.cls.get<User>('user');
    if (!user) {
      // This would typically mean the service is being used in a non-request scope
      // where no user is authenticated.
      throw new Error('No user found in context');
    }
    return user;
  }

  /**
   * Sets the authenticated user in the request context.
   * This is typically called from a middleware or guard.
   */
  set currentUser(user: User) {
    this.cls.set('user', user);
  }
}
