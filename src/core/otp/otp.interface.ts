import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum Type {
  WEB = 'web',
  MOBILE = 'mobile',
}

export class OtpConfiguration {
  @ApiProperty({
    type: Number,
    description: 'OTP length',
  })
  @IsNotEmpty()
  @IsInt()
  otpLength: number;

  @ApiProperty({
    type: String,
    description: 'OTP expiration time',
  })
  @IsNotEmpty()
  @IsString()
  expirationTime: string;

  @ApiProperty({
    type: Boolean,
    description: 'OTP should contain alphabets or not',
  })
  @IsOptional()
  @IsBoolean()
  alphabets: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'OTP should contain uppercase letter or not',
  })
  @IsOptional()
  @IsBoolean()
  upperCase: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'OTP should contain special characters letter or not',
  })
  @IsOptional()
  @IsBoolean()
  specialChar: boolean;

  @ApiProperty({
    type: String,
    description: 'This define OTP type',
    enum: Type,
  })
  @IsNotEmpty()
  type: Type;
}

export class GetNewOtpParams {
  @ApiProperty({
    type: String,
    description: 'This define OTP type',
    enum: Type,
  })
  @IsNotEmpty()
  type: Type;

  @ApiProperty({
    type: String,
    description: 'If the recipient wants to receive OTP through mail',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    description: 'If the recipient wants to receive OTP through message',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNo?: string;
}

export class RecievedOtp {
  @ApiProperty({
    type: String,
    description: 'This define OTP type',
    enum: Type,
  })
  @IsNotEmpty()
  type: Type;

  @ApiProperty({
    type: String,
    description: 'OTP to verify',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiPropertyOptional({
    type: String,
    description: 'If the recipient has received OTP through mail',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'If the recipient has received OTP through message',
  })
  @IsOptional()
  @IsString()
  phoneNo?: string;
}
