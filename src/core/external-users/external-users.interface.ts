export interface externalUser {
  userName: string;

  firstName: string;

  lastName: string;

  profilePic?: string;

  email?: string;

  provider?: string;

  password?: string;

  otp?: string;

  otpExpirationTime?: Date;

  emailOtpVerified?: boolean;

  smsOtpVerified?: boolean;

  otpType?: string;

  sub?: string;

  accessToken?: string;

  refreshToken?: string;
}
