/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:28:03
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-25 23:33:06
 */

import { Injectable } from '@nestjs/common';
import {
  PaginatedResponse,
  PaginationInterface,
} from '../interfaces/pagination.interface';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export default class PaginationService {
  constructor(private readonly entityManager: EntityManager) {}

  async pagination(
    selectQuery: string,
    countQuery: string,
    paginate: PaginationInterface,
    replacements?: any[],
  ): Promise<PaginatedResponse> {
    const page = paginate.page ?? 1;
    const size = paginate.size ?? 10;
    const limit = page * size;
    const offset = page === 1 ? 0 : (page - 1) * size;
    const totalRows = await this.entityManager.execute(
      countQuery,
      replacements,
    );
    selectQuery += ` limit $${replacements.length + 1}`;
    replacements.push(limit);
    selectQuery += ` offset $${replacements.length + 1} `;
    replacements.push(offset);
    const records = await this.entityManager.execute(selectQuery, replacements);
    const total = (totalRows.length && totalRows[0]?.count) || 0;
    const pages = Math.ceil(total / limit);
    const hasNext = total - offset > limit;
    return {
      records,
      totalRecords: Number(total),
      totalPages: pages,
      hasNext,
    };
  }
}
