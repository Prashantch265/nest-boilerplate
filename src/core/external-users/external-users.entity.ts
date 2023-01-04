/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:13:26
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-30 23:07:23
 */

import CommonEntity from '@core/Common/entities/common.entity';
import { OtpType } from '@core/otp/otp.dto';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'external_users' })
export default class ExternalUser extends CommonEntity {
  @PrimaryKey({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string = v4();

  @Property({ name: 'user_name' })
  userName: string;

  @Property({ name: 'first_name' })
  firstName: string;

  @Property({ name: 'last_name' })
  lastName: string;

  @Property({ name: 'profile_pic', nullable: true })
  profilePic: string;

  @Property({ name: 'email', nullable: true })
  email?: string;

  @Property({ name: 'contact_no', nullable: true })
  contactNo?: string;

  @Property({ name: 'provider', nullable: true })
  provider?: string;

  @Property({ name: 'password', nullable: true })
  password?: string;

  @Property({ name: 'otp', nullable: true })
  otp?: string;

  @Property({ name: 'otp_expiration_time', type: 'timestamp', nullable: true })
  otpExpirationTime?: Date;

  @Property({ name: 'email_otp_verified', type: 'boolean', default: false })
  emailOtpVerified?: boolean;

  @Property({ name: 'sms_otp_verified', type: 'boolean', default: false })
  smsOtpVerified?: boolean;

  @Property({ name: 'otp_type', default: OtpType.WEB })
  otpType?: string;

  @Property({ name: 'token', nullable: true })
  sub?: string;

  @Property({ name: 'access_token', nullable: true })
  accessToken?: string;

  @Property({ name: 'refresh_token', nullable: true })
  refreshToken?: string;
}
