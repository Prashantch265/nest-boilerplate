import { Column, Entity } from 'typeorm';
import PrimaryEntity from '../Common/entities/primary.entity';
import { Type } from './otp.interface';

@Entity({ name: 'otp_configuration' })
export default class OTP extends PrimaryEntity {
  @Column({ name: 'otp_length' })
  otpLength: number;

  @Column({ name: 'expiration_time' })
  expirationTime: string;

  @Column({ name: 'alphabets', type: 'boolean', default: false })
  alphabets: boolean;

  @Column({ name: 'uppercase', type: 'boolean', default: false })
  upperCase: boolean;

  @Column({ name: 'special_char', type: 'boolean', default: false })
  specialChar: boolean;

  @Column({ name: 'type', type: 'enum', enum: Type, default: 'web' })
  type: string;
}
