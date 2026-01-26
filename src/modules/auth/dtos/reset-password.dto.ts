import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The password reset token received via email.',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The new password for the account.',
    example: 'newSecurePassword123',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmation of the new password.',
    example: 'newSecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
