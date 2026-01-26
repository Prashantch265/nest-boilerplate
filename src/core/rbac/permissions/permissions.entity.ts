import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TimeStamp } from '../../../common/entities/timestamp.entity';

@Entity('permissions')
export class Permission extends TimeStamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string; // e.g., "Create User"

  @Column({ type: 'varchar', length: 255, unique: true })
  code: string; // e.g., "user:create"
}
