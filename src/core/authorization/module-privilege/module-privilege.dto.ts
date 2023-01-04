import { ToTrimmed, ToUpperCase } from '@decorators/transform-input.decorator';
import { ValidateIfExists } from '@decorators/validation.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum HttpMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export class CreateModulePrivilegeMappingDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToUpperCase()
  @ValidateIfExists({ table: 'modules', column: 'code' })
  moduleCode: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToUpperCase()
  @ValidateIfExists({ table: 'privileges', column: 'code' })
  privilegeCode: string;

  @ApiProperty({ type: String, enum: HttpMethods })
  @IsNotEmpty()
  @IsString()
  method: HttpMethods;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  endpoint: string;
}

export class UpdateModulePrivilegeMappingDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToUpperCase()
  @ValidateIfExists({ table: 'modules', column: 'code' })
  moduleCode?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToUpperCase()
  @ValidateIfExists({ table: 'privileges', column: 'code' })
  privilegeCode?: string;

  @ApiPropertyOptional({ type: String, enum: HttpMethods })
  @IsOptional()
  @IsString()
  method?: HttpMethods;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  endpoint?: string;
}
