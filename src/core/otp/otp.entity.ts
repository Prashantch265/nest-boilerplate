/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 22:18:03
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 17:24:38
 */

import PrimaryEntity from '@core/Common/entities/primary.entity';
import { Entity, Enum, Property } from '@mikro-orm/core';
import { OtpType } from './otp.dto';

@Entity({ tableName: 'otp_configurations' })
export default class OTP extends PrimaryEntity {
  @Property({ name: 'otp_length' })
  otpLength: number;

  @Property({ name: 'expiration_time' })
  expirationTime: string;

  @Property({ name: 'alphabets', type: 'boolean', default: false })
  alphabets: boolean;

  @Property({ name: 'uppercase', type: 'boolean', default: false })
  upperCase: boolean;

  @Property({ name: 'special_char', type: 'boolean', default: false })
  specialChar: boolean;

  @Property({ name: 'digits', type: 'boolean', default: false })
  digits: boolean;

  @Enum({ items: () => OtpType, name: 'type', default: OtpType.WEB })
  type: OtpType;
}
