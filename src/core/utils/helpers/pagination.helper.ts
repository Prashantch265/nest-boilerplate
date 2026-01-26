import {
  IPaginatedResponse,
  IPaginationMeta,
} from '../../../common/interfaces/pagination.interface';

export function getPaginationParams(
  page = 1,
  size = 10,
  sort: 'ASC' | 'DESC' = 'ASC',
  sortBy = 'createdAt',
) {
  const limit = Math.max(size, 1);
  const offset = (Math.max(page, 1) - 1) * limit;

  return {
    limit,
    offset,
    sortOrder: sort,
    sortBy,
  };
}

export function formatPaginatedResponse<T>(
  totalRecords: number,
  items: T[],
  page: number,
  size: number,
): IPaginatedResponse<T> {
  const totalPages = Math.ceil(totalRecords / size);

  const meta: IPaginationMeta = {
    totalRecords,
    page,
    size,
    totalPages,
  };

  return { items, meta };
}
