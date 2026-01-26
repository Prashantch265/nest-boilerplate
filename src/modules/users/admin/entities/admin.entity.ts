import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TimeStamp } from '../../../../common/entities/timestamp.entity';
import { User } from '../../users.entity';

@Entity('admins')
export class Admin extends TimeStamp {
  @PrimaryGeneratedColumn('uuid')
  adminId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 64 })
  firstName: string;

  @Column({ type: 'varchar', length: 64 })
  lastName: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  contactNumber: string;
}
