import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationInterface } from 'src/core/Common/interfaces/pagination.interface';

export class TypesRole {
  @ApiProperty({ type: String, description: 'role name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, description: 'code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, description: 'role description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class QueryStringsRole extends PaginationInterface {
  @IsOptional()
  include?: string[];
}
