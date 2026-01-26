import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsIn } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/query-pagination.dto';
import { USER_STATUS } from '../../../../common/enums/users.enum';

// Define the allowed sortable columns
const ALLOWED_SORT_COLUMNS = [
  'firstName',
  'email',
  'lastLoginAt',
  'createdAt',
  'updatedAt',
] as const;
type AllowedSortColumn = (typeof ALLOWED_SORT_COLUMNS)[number];

export class AdminQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for admin first name, last name, or email',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    enum: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE],
    description: 'Filter admins by status (ACTIVE or INACTIVE)',
  })
  @IsEnum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE])
  @IsOptional()
  status?: USER_STATUS;

  @ApiPropertyOptional({
    description: `Column to sort by. Allowed values: ${ALLOWED_SORT_COLUMNS.join(', ')}`, // Updated description
    example: 'lastLoginAt',
    enum: ALLOWED_SORT_COLUMNS, // Add enum for Swagger documentation
  })
  @IsString()
  @IsIn(ALLOWED_SORT_COLUMNS, {
    // Add validation
    message: `sortBy must be one of the following values: ${ALLOWED_SORT_COLUMNS.join(', ')}`,
  })
  @IsOptional()
  sortBy: AllowedSortColumn = 'createdAt'; // Default sort, ensure type safety
}
