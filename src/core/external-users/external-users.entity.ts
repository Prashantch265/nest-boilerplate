import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from '../otp/otp.interface';

@Entity({ name: 'external_users' })
export default class ExternalUser {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'email', nullable: true })
  email?: string;

  @Column({ name: 'provider', nullable: true })
  provider?: string;

  @Column({ name: 'password', nullable: true })
  password?: string;

  @Column({ name: 'otp', nullable: true })
  otp?: string;

  @Column({ name: 'otp_expiration_time', type: 'timestamp', nullable: true })
  otpExpirationTime?: Date;

  @Column({ name: 'email_otp_verified', type: 'boolean', default: false })
  emailOtpVerified?: boolean;

  @Column({ name: 'sms_otp_verified', type: 'boolean', default: false })
  smsOtpVerified?: boolean;

  @Column({ name: 'otp_type', type: 'enum', enum: Type, default: Type.WEB })
  otpType?: string;

  @Column({ name: 'token', nullable: true })
  token?: string;
}
