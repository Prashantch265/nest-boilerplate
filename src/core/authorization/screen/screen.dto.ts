import { ToTrimmed, ToUpperCase } from '@decorators/transform-input.decorator';
import { ValidateIfDuplicate } from '@decorators/validation.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateScreenDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  @ValidateIfDuplicate({ table: 'screens', column: 'name' })
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToUpperCase()
  @ValidateIfDuplicate({ table: 'screens', column: 'code' })
  code: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  description: string;
}

export class UpdateScreenDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  @ValidateIfDuplicate({ table: 'screens', column: 'name' })
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToUpperCase()
  @ValidateIfDuplicate({ table: 'screens', column: 'code' })
  code?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  description?: string;
}
