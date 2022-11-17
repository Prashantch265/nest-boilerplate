/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 11:30:17
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-16 20:47:56
 */

import {
  ArgumentMetadata,
  PipeTransform,
  ValidationPipeOptions,
} from '@nestjs/common';
import { validate, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { isNil } from 'lodash';
import { ErrorFormatter } from 'src/utils/error-formatter';

const env = process.env.NODE_ENV;

/**
 * Custom Validation Pipe in nestjs
 * https://progressivecoder.com/how-to-configure-a-custom-nestjs-pipe-from-scratch/
 *
 * Validator Options
 * https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
 *                          Or
 * you can look into ValidationPipe type definition
 */
export class CustomValidationPipe implements PipeTransform<any> {
  protected isTransformEnabled: boolean;
  protected isErrorMessageDisabled: boolean;
  protected validatorOptions: ValidatorOptions;
  constructor(options?: ValidationPipeOptions) {
    options = Object.assign(
      {
        transform: true,
        validateCustomDecorators: true,
        enableDebugMessages: env !== 'development' ? true : false,
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        forbidUnknownValues: true,
      },
      options || {},
    );
    const { transform, disableErrorMessages, ...validatorOptions } = options;
    this.isTransformEnabled = transform;
    this.isErrorMessageDisabled = disableErrorMessages;
    this.validatorOptions = validatorOptions;
  }

  public async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.validateMetaType(metadata)) {
      return value;
    }

    const object = plainToClass(metatype, this.toEmptyIfNil(value));

    const errors = await validate(object, this.validatorOptions);

    if (errors.length > 0) {
      ErrorFormatter(errors);
    }

    return value;
  }

  protected validateMetaType(metadata: ArgumentMetadata): boolean {
    const { metatype, type } = metadata;
    if (type === 'custom') {
      return false;
    }
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  protected toEmptyIfNil<T = any, R = any>(value: T): R | {} {
    return isNil(value) ? {} : value;
  }
}
