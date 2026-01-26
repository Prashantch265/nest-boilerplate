import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'], { message: 'sort must be either ASC or DESC' })
  sort: string = 'DESC';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';
}
