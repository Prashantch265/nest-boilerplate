/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-22 22:28:05
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-11-22 22:28:05
 */

import { HttpException } from '@nestjs/common';

export default class FileNotFoundException extends HttpException {
  getMessage(): string {
    return 'File is a required field.';
  }

  getStatus(): number {
    return 422;
  }
  public getCode(): number {
    return 422;
  }

  getSource(): string | string[] {
    return '';
  }

  getDescription(): string {
    return 'File is required filed.Please make sure file exists on a request';
  }
}
