import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class OtpConfiguration {
  @IsNotEmpty()
  @IsInt()
  otpLength: number;

  @IsNotEmpty()
  @IsString()
  expirationTime: string;

  @IsOptional()
  @IsBoolean()
  alphabets: boolean;

  @IsOptional()
  @IsBoolean()
  upperCase: boolean;

  @IsOptional()
  @IsBoolean()
  specialChar: boolean;

  @IsNotEmpty()
  type: Type;
}

export enum Type {
  WEB = 'web',
  MOBILE = 'mobile',
}

export class GetNewOtpParams {
  @IsNotEmpty()
  type: Type;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNo?: string;
}

export class RecievedOtp {
  @IsNotEmpty()
  type: Type;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNo?: string;
}
