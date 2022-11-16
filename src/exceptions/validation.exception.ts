/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 11:24:47
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-16 09:52:03
 */

import { HttpException } from '@nestjs/common';

export default class ValidationException extends HttpException {
  private readonly errors: Record<string, string[]>;
  constructor(errors: Record<string, string[]>) {
    super('Cannot Process Request Body', 422);
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}
