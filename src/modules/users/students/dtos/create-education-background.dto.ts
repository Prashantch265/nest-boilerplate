import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { EDUCATION_LEVEL, MARKING_SYSTEM } from '../enums/student-profile.enum';

export class CreateEducationBackgroundDto {
  @ApiProperty({ enum: EDUCATION_LEVEL })
  @IsEnum(EDUCATION_LEVEL)
  @IsNotEmpty()
  educationLevel: EDUCATION_LEVEL;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  programStream: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  programName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryOfStudy: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  boardUniversity: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  institutionName: string;

  @ApiProperty()
  @IsString()
  @Length(4, 4)
  graduationYear: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({ enum: MARKING_SYSTEM })
  @IsEnum(MARKING_SYSTEM)
  markingSystem: MARKING_SYSTEM;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Transcript file (max 5MB, .png, .jpeg, .jpg, .pdf)',
  })
  @IsOptional()
  transcript?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Certificate/Diploma file (max 5MB, .png, .jpeg, .jpg, .pdf)',
  })
  @IsOptional()
  certificate?: any;
}
