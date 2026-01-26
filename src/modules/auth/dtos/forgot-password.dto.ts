import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email address for the account to reset the password for.',
    example: 'student@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
