import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import {
  ENGLISH_PROFICIENCY_TEST_TYPE,
  KOREAN_LANGUAGE_TEST_TYPE,
} from '../enums/student-profile.enum';

export class CreateTestScoreDto {
  @ApiProperty({ enum: ENGLISH_PROFICIENCY_TEST_TYPE, required: false })
  @IsEnum(ENGLISH_PROFICIENCY_TEST_TYPE)
  @IsOptional()
  englishTestType?: ENGLISH_PROFICIENCY_TEST_TYPE;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  englishTestScore?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  englishTestDate?: string;

  @ApiProperty({ enum: KOREAN_LANGUAGE_TEST_TYPE, required: false })
  @IsEnum(KOREAN_LANGUAGE_TEST_TYPE)
  @IsOptional()
  koreanTestType?: KOREAN_LANGUAGE_TEST_TYPE;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  koreanTestScore?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  koreanTestDate?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'English test report (max 5MB, .png, .jpeg, .jpg, .pdf)',
  })
  @IsOptional()
  englishTestReport?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Korean test report (max 5MB, .png, .jpeg, .jpg, .pdf)',
  })
  @IsOptional()
  koreanTestReport?: any;
}
