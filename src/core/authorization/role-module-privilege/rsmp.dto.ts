import { ValidateIfExists } from '@decorators/validation.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRsmpDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @ValidateIfExists({ table: 'roles', column: 'id' })
  roleId: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @ValidateIfExists({ table: 'module_privilege_mapping', column: 'id' })
  mpmId: number;
}

export class RsmpQueryStringDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @ValidateIfExists({ table: 'roles', column: 'id' })
  roleId: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @ValidateIfExists({ table: 'screens', column: 'id' })
  screenId: number;
}

export class RsmpDeleteQueryStringDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @ValidateIfExists({ table: 'roles', column: 'id' })
  roleId: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @ValidateIfExists({ table: 'module_privilege_mapping', column: 'id' })
  mpmId: number;
}
