import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TimeStamp } from '../../../common/entities/timestamp.entity';
import { Permission } from '../permissions/permissions.entity';

@Entity('roles')
export class Role extends TimeStamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string; // e.g., "Super Admin", "Manager"

  @Column({ type: 'text', nullable: true })
  description: string; // New field for UI clarity

  @ManyToMany(() => Permission, { eager: true }) // eager: true automatically loads permissions when a role is fetched
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
