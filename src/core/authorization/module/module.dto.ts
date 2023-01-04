import { ToTrimmed, ToUpperCase } from '@decorators/transform-input.decorator';
import {
  ValidateIfDuplicate,
  ValidateIfExists,
} from '@decorators/validation.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  @ValidateIfDuplicate({ table: 'modules', column: 'name' })
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToUpperCase()
  @ValidateIfDuplicate({ table: 'modules', column: 'code' })
  code: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  description: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToUpperCase()
  @ValidateIfExists({ table: 'screens', column: 'code' })
  screenCode: string;
}

export class UpdateModuleDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToUpperCase()
  code?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  description?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToUpperCase()
  screenCode?: string;
}
