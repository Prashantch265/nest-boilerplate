import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    description: 'The email address to which the OTP should be resent.',
    example: 'mail@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
