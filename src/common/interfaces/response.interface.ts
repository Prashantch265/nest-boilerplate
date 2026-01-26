import { IPaginationMeta } from './pagination.interface';

export interface ISuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface IPaginatedSuccessResponse<T> {
  success: true;
  message: string;
  data: T[];
  meta: IPaginationMeta;
}
