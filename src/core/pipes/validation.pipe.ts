import {
  ArgumentMetadata,
  PipeTransform,
  ValidationPipeOptions,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { validate, ValidatorOptions, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { isNil } from 'lodash';
import { ErrorFormatter } from '../utils/formatter/error.formatter';

export class CustomValidationPipe implements PipeTransform<unknown> {
  private readonly isTransformEnabled: boolean;
  private readonly isErrorMessageDisabled: boolean;
  private readonly validatorOptions: ValidatorOptions;

  constructor(options?: ValidationPipeOptions) {
    options = Object.assign(
      {
        transform: true,
        validateCustomDecorators: true,
        enableDebugMessages: process.env.NODE_ENV !== 'production',
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        forbidUnknownValues: true,
      },
      options ?? {},
    );

    const { transform, disableErrorMessages, ...validatorOptions } = options;
    this.isTransformEnabled = transform ?? true;
    this.isErrorMessageDisabled = !!disableErrorMessages;
    this.validatorOptions = validatorOptions as ValidatorOptions;
  }

  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    const { metatype } = metadata;

    if (!metatype || !this.shouldValidate(metadata)) {
      return value;
    }

    // safe conversion
    const object = plainToInstance(
      metatype as new (...args: any[]) => any,
      this.toEmptyIfNil(value),
      {
        enableImplicitConversion: metadata.type !== 'query',
      },
    ) as Record<string, unknown>;

    // type the result of validate properly
    const errors: ValidationError[] = await validate(object, {
      ...this.validatorOptions,
      whitelist: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    });

    if (errors.length > 0) {
      if (this.isErrorMessageDisabled) {
        throw new BadRequestException();
      }
      throw new BadRequestException(ErrorFormatter(errors));
    }

    return object;
  }

  private shouldValidate(metadata: ArgumentMetadata): boolean {
    const { metatype, type } = metadata;
    if (type === 'custom' || !metatype) {
      return false;
    }
    const noValidateTypes: Array<Type<unknown>> = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !noValidateTypes.includes(metatype as Type<unknown>);
  }

  private toEmptyIfNil<T>(value: T): T | Record<string, never> {
    return isNil(value) ? {} : value;
  }
}
