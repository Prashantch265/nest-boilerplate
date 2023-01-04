import { ToTrimmed, ToUpperCase } from '@decorators/transform-input.decorator';
import { ValidateIfDuplicate } from '@decorators/validation.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationInterface } from 'src/core/Common/interfaces/pagination.interface';

export class CreateRoleDto {
  @ApiProperty({ type: String, description: 'role name' })
  @IsString()
  @IsNotEmpty()
  @ToTrimmed()
  @ValidateIfDuplicate({ table: 'roles', column: 'name' })
  name: string;

  @ApiProperty({ type: String, description: 'code' })
  @IsString()
  @IsNotEmpty()
  @ToUpperCase()
  @ValidateIfDuplicate({ table: 'roles', column: 'code' })
  code: string;

  @ApiProperty({ type: String, description: 'role description' })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  description: string;
}

export class QueryStringsRole extends PaginationInterface {
  @IsOptional()
  include?: string[];
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ type: String, description: 'role name' })
  @IsString()
  @IsOptional()
  @ToTrimmed()
  @ValidateIfDuplicate({ table: 'roles', column: 'name' })
  name?: string;

  @ApiPropertyOptional({ type: String, description: 'code' })
  @IsString()
  @IsOptional()
  @ToUpperCase()
  @ValidateIfDuplicate({ table: 'roles', column: 'code' })
  code?: string;

  @ApiPropertyOptional({ type: String, description: 'role description' })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  description?: string;
}
