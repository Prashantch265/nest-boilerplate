/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:15:46
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-30 22:54:30
 */

import { Property } from '@mikro-orm/core';

export default class CommonEntity {
  @Property({ name: 'created_at', nullable: true })
  createdAt: Date = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date(), nullable: true })
  updatedAt: Date;

  @Property({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @Property({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  @Property({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Property({
    name: 'is_permanent',
    type: 'boolean',
    default: false,
  })
  isPermanent: boolean;
}
