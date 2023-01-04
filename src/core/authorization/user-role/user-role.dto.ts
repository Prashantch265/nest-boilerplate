import { ToUpperCase } from '@decorators/transform-input.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserRoleDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  internalUserId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  externalUserId?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToUpperCase()
  roleCode: string;
}

export class UserRoleDeleteQueryStringDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsInt()
  roleId: number;
}
