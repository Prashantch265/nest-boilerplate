/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 22:18:03
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 14:56:08
 */

import PrimaryEntity from '@core/Common/entities/primary.entity';
import { OtpType } from './otp.dto';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'otp_configurations' })
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

  @Column({ name: 'digits', type: 'boolean', default: false })
  digits: boolean;

  @Column({ name: 'type', type: 'enum', enum: OtpType, default: OtpType.WEB })
  type: OtpType;
}
