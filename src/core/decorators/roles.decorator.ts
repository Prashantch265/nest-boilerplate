import { SetMetadata } from '@nestjs/common';
import { USER_TYPE } from '../../common/enums/users.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: USER_TYPE[]) => SetMetadata(ROLES_KEY, roles);
