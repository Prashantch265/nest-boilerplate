import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'The email address of the user to verify',
    example: 'student@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The 6-digit OTP code sent to the user email',
    example: '123456',
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be a 6-digit code' })
  otpCode: string;
}
