import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import CommonEntity from '../Common/entities/common.entity';

@Entity({ name: 'users' })
export default class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'contact' })
  contact: string;

  @Column({ name: 'profile_pic', nullable: true })
  profilePic: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'password', nullable: true })
  password: string;
}
