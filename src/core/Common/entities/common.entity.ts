/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:15:46
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-16 20:20:15
 */

import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default class CommonEntity {
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    select: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true, select: false })
  updatedBy: string;

  @Column({ name: 'is_active', type: 'boolean', default: true, select: false })
  isActive: boolean;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    default: false,
    select: false,
  })
  isDeleted: boolean;

  @Column({
    name: 'is_permanent',
    type: 'boolean',
    default: false,
    select: false,
  })
  isPermanent: boolean;
}
