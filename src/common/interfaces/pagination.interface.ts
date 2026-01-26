export interface IPaginationMeta {
  totalRecords: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  items: T[];
  meta: IPaginationMeta;
}
