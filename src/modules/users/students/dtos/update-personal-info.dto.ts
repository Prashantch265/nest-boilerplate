import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { USER_GENDERS } from '../../../../common/enums/users.enum';

export class UpdatePersonalInfoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: USER_GENDERS })
  @IsEnum(USER_GENDERS)
  gender: USER_GENDERS;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryOfCitizenship: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @ApiProperty()
  @IsDateString()
  passportExpiryDate: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Student profile photo (max 5MB, .png, .jpeg, .jpg)',
  })
  @IsOptional()
  photo?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Passport scan (max 5MB, .png, .jpeg, .jpg, .pdf)',
  })
  @IsOptional()
  passport?: any;
}
