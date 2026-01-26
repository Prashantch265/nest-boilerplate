import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateAdminProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string; // Allow email update via profile endpoint too
}
