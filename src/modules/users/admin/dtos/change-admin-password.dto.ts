import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangeAdminPasswordDto {
  @ApiProperty({ description: 'The new password.' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;

  @ApiProperty({ description: 'Confirmation of the new password.' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
