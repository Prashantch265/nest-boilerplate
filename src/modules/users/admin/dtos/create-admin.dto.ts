import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Initial password for the new admin.' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Confirmation of the initial password.' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiProperty({
    description: 'Array of role IDs to assign to the new admin.',
    example: ['uuid-for-super-admin-role'],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  roleIds: string[];
}
