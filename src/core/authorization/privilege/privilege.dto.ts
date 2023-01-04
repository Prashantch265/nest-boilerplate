import { ToTrimmed, ToUpperCase } from '@decorators/transform-input.decorator';
import { ValidateIfDuplicate } from '@decorators/validation.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePrivilegeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  @ValidateIfDuplicate({ table: 'privileges', column: 'name' })
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToUpperCase()
  @ValidateIfDuplicate({ table: 'privileges', column: 'code' })
  code: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  description: string;
}

export class UpdatePrivilegeDto {
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
}
