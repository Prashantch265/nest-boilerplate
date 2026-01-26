import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, Length } from 'class-validator';

export class CreateVisaHistoryDto {
  @ApiProperty()
  @IsBoolean()
  hasBeenDenied: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  visaType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Length(4, 4)
  applicationYear?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reasonForDenial?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  additionalNotes?: string;
}
