import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export enum Sort {
  DESC = 'desc',
  ASC = 'asc',
}

export class PaginationInterface {
  @ApiPropertyOptional({ type: Number, default: 1, description: 'page no.' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    default: 100,
    description: 'no. of records to fetch',
  })
  @IsOptional()
  size?: number;

  @ApiPropertyOptional({ type: String, enum: Sort, description: 'order by' })
  @IsOptional()
  sort?: Sort;
}

export interface PaginatedResponse {
  records: any;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
}
