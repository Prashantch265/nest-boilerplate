/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-27 22:27:16
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:49:29
 */

import { userType } from '@auth/auth.interface';
import { PaginationInterface } from '@core/Common/interfaces/pagination.interface';
import PaginationService from '@core/Common/services/pagination.service';
import { FindOptions } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import UserRole from './user-role.entity';

export default class UserRoleRepository extends EntityRepository<UserRole> {
  @Inject()
  private readonly paginationService: PaginationService;

  private readonly entityManager = this.em.getConnection();

  async findOneByFeild(where = {}, options: FindOptions<UserRole> = {}) {
    where = { ...where, isActive: true };
    return await this.findOne(where, options);
  }

  async getInternalUsers(userId?: string) {
    const replacement: Array<any> = [userId];

    const whereQuery = ` and ur.internal_user_id = ?`;
    return await this.entityManager.execute(
      `
    select
    users.user_id as "userId", users.user_name as "userName", users.full_name as "name", users.profile_pic as "profilePic",
    users.email as "email", users.contact as "contact", roles.name as "role"
    from user_role ur
    inner join roles on roles.id = ur.role_id and roles.is_active is true
    inner join users on users.user_id = ur.internal_user_id and users.is_active is true
    where ur.is_active = true ${userId ? whereQuery : ''} 
`,
      replacement,
    );
  }

  async getUsersByRole(
    roleId?: number,
    paginationInterface?: PaginationInterface,
  ) {
    const replacement: Array<any> = [roleId];

    const whereQuery = ` and ur.role_id = ?`;

    const selectQuery = `
    select
    roles.id,
    roles.name as "role",
    jsonb_agg(jsonb_build_object('userId', users.user_id, 'userName', users.user_name, 'name', users.full_name, 'profile_pic',
        users.profile_pic, 'email', users.email, 'contact', users.contact, 'role', roles.name))
    from user_role ur
    inner join users on users.user_id = ur.internal_user_id and users.is_active is true
    inner join roles on roles.id = ur.role_id and roles.is_active is true
    where ur.is_active is true ${roleId ? whereQuery : ''}
    group by 1, 2
    `;

    const countQuery = `select
    count(ur.user_id)
    from user_role ur
    inner join users on users.user_id = ur.internal_user_id and users.is_active is true
    inner join roles on roles.id = ur.role_id and roles.is_active is true
    where ur.is_active is true ${roleId ? whereQuery : ''} `;

    this.paginationService.pagination(
      selectQuery,
      countQuery,
      paginationInterface,
      replacement,
    );
  }

  async getPermissionsForUser(userId: string, type: userType) {
    const replacement: Array<any> = [userId];

    let whereQuery: string;

    if (type === userType.INTERNAL)
      whereQuery = ` and urm.internal_user_id = ? `;
    else if (type === userType.EXTERNAL)
      whereQuery = ` and urm.external_user_id = ?`;

    return await this.entityManager.execute(
      `
      with modules as (
        select
        modules.screen_id as "screenId",
        modules.name as "module",
        urm.role_id as "roleId",
        jsonb_agg(jsonb_build_object('privilege', privileges.name, 'code', privileges.code, 'endpoint', mpm.endpoint)) as "permissions"
        from rsmp
        inner join module_privilege_mapping mpm on rsmp.mpm_id = mpm.id and mpm.is_active is true
        inner join user_role urm on rsmp.role_id = urm.role_id and urm.is_active is true
        inner join modules on mpm.module_id = modules.id and modules.is_active is true
        inner join privileges on mpm.privilege_id = privileges.id and privileges.is_active is true
        group by 1, 2, 3
    ) select
    screens.name as "screen",
    jsonb_agg(jsonb_build_object('module', modules.module, 'permissions', modules.permissions)) as "hasAccess"
    from modules
    inner join screens on screens.id = modules."screenId" and screens.is_active is true
    inner join user_role urm on urm.role_id = modules."roleId"
    where urm.is_active = true ${whereQuery}
    group by 1
    `,
      replacement,
    );
  }
}
