/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:15:46
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 11:15:27
 */

import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default class CommonEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_permanent', type: 'boolean', default: false })
  isPermanent: boolean;
}
