import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeStamp } from '../../../../common/entities/timestamp.entity';
import { USER_GENDERS } from '../../../../common/enums/users.enum';
import { User } from '../../users.entity';

@Entity('students')
export class Student extends TimeStamp {
  @PrimaryGeneratedColumn('uuid')
  studentId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', default: 0 })
  profileCompletionStep: number;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: USER_GENDERS, nullable: true })
  gender: USER_GENDERS;

  @Column({ type: 'varchar', length: 128, nullable: true })
  countryOfCitizenship: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  passportNumber: string;

  @Column({ type: 'date', nullable: true })
  passportExpiryDate: Date;

  @Column({ nullable: true })
  passportFileUrl: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  stateProvince: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  postalCode: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  secondaryPhoneNumber: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  whatsappNumber: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  fathersName: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  fathersContactNumber: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  mothersName: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  mothersContactNumber: string;
}
