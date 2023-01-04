/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 22:40:36
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-12-26 22:40:36
 */

import { HttpStatus } from '@nestjs/common';

export class InvalidFileException extends Error {
  readonly message = 'Invalid file';
  private readonly status: HttpStatus.UNSUPPORTED_MEDIA_TYPE;
  private readonly source: string | string[];
  private readonly description: string;

  constructor(source: string | string[], description: string) {
    super();
    this.source = source;
    this.description = description;
  }

  getMessage(): string {
    return this.message;
  }

  public getStatus(): HttpStatus {
    return this.status;
  }

  getSource(): string | string[] {
    return this.source;
  }

  getDescription(): string {
    return this.description;
  }
}
