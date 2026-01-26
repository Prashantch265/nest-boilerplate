import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { TimeStamp } from '../../common/entities/timestamp.entity';
import {
  USER_TYPE,
  USER_STATUS,
  SIGNUP_METHOD,
  OAUTH_PROVIDERS,
} from '../../common/enums/users.enum';
import { Student } from './students/entities/students.entity';
import { Admin } from './admin/entities/admin.entity';
import { Role } from '../../core/rbac/roles/roles.entity';

@Entity('users')
export class User extends TimeStamp {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: USER_TYPE,
    default: USER_TYPE.STUDENT,
  })
  userType: USER_TYPE;

  @Column({
    type: 'enum',
    enum: USER_STATUS,
    default: USER_STATUS.PENDING,
  })
  status: USER_STATUS;

  @Column({
    type: 'varchar',
    length: 128,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password?: string;

  @Column({
    type: 'enum',
    enum: SIGNUP_METHOD,
    default: SIGNUP_METHOD.EMAIL,
  })
  signUpMethod: SIGNUP_METHOD;

  @Column({
    type: 'enum',
    enum: OAUTH_PROVIDERS,
    nullable: true,
  })
  oAuthProvider?: OAUTH_PROVIDERS;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  oAuthId?: string;

  @Column({ type: 'timestamp', nullable: true }) // New field
  lastLoginAt: Date;

  // --- Relationships ---
  @OneToOne(() => Student, (student) => student.user)
  student: Student;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin: Admin;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
