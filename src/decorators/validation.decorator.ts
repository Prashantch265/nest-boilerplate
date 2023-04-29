/*
 * @Author: prashant.chaudhary
 * @Date: 2023-01-01 22:57:37
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-02 11:31:08
 */

import { RuntimeException } from '@exceptions/runtime.exception';
import { RequestContext } from '@mikro-orm/core';
import { HttpStatus } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const ValidateIfDuplicate = (
  input: {
    table: string;
    column: string;
  },
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateIfDuplicate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [input],
      validator: ValidateIfDuplicateConstraint,
    });
  };
};

export function ToBoolean(): (target: any, key: string) => void {
  return Transform((value: any) => {
    value = value.value;
    return value === 'true' || value === true || value === 1 || value === '1';
  });
}
export function ToNumber(): (target: any, key: string) => void {
  return Transform((value: any) => {
    value = value.value;
    return Number(value);
  });
}
export function MapToNumber(): (target: any, key: string) => void {
  return Transform((value: any) => {
    value = value.value;
    return value === 'FIRST'
      ? 1
      : value === 'SECOND'
      ? 2
      : value === 'THIRD'
      ? 3
      : value === 'FOURTH'
      ? 4
      : null;
  });
}
export function MakeArray(): (target: any, key: string) => void {
  return Transform((value: any) => {
    value = value.value;
    if (!Array.isArray(value)) {
      return [value];
    }
    return value;
  });
}

export function ParseToArray(): (target: any, key: string) => void {
  return Transform((value: any) => {
    value = value.value;
    return JSON.parse(value);
  });
}
@ValidatorConstraint({ name: 'validateIfDuplicate', async: true })
class ValidateIfDuplicateConstraint implements ValidatorConstraintInterface {
  async validate(
    data,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    // returns constraints passed to the decorator
    // example: {table: string, column: string}
    const sqlConstraints = validationArguments.constraints[0];
    const { table, column } = sqlConstraints;

    // validate against database
    const res = await RequestContext.getEntityManager()
      .getConnection()
      .execute(`select count(*) as ok from ${table} where ${column} = ?;`, [
        data,
      ]);

    if (res[0].ok === '0') {
      return true;
    }

    // check if the data belongs to the same record
    const myObject: any = validationArguments.object;
    if (myObject.id || myObject.userId) {
      const result = await RequestContext.getEntityManager()
        .getConnection()
        .execute(`select * from ${table} where ${column} = ?;`, [data]);

      const entity = result[0];

      if (entity?.id == myObject.id) return true;
      if (entity?.userId == myObject.userId) return true;
    }

    // throw duplicate exception
    throw new RuntimeException(
      HttpStatus.BAD_REQUEST,
      `Validation Error: ${validationArguments.property} with value ${validationArguments.value} already exists`,
      [table],
    );
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Given data: ${validationArguments.value} already exists`;
  }
}

export const ValidateIfPhoneNumber = (
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidateIfPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateIfPhoneNumberConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'ValidateIfPhoneNumberConstraint', async: true })
class ValidateIfPhoneNumberConstraint implements ValidatorConstraintInterface {
  async validate(
    data,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    // validate phone number length
    if (data?.length !== 10) {
      throw new RuntimeException(
        HttpStatus.BAD_REQUEST,
        'Invalid %s, phone number must be of length 10',
        'Phone Number',
      );
    }
    // validate phone number prefix : 98 or 97
    const phoneNumberPrefix = data.slice(0, 2);
    if (phoneNumberPrefix !== '98' && phoneNumberPrefix !== '97') {
      throw new RuntimeException(
        HttpStatus.BAD_REQUEST,
        'Invalid %s, phone number must start with `98` or `97`',
        'Phone Number',
      );
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Invalid phone number: ${validationArguments.value}`;
  }
}

export const ValidateIfExists = (
  input: {
    table: string;
    column: string;
  },
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateIfExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [input],
      validator: ValidateIfExistsConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'validateIfExists', async: true })
class ValidateIfExistsConstraint implements ValidatorConstraintInterface {
  async validate(
    data,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    // returns constraints passed to the decorator
    // example: {table: string, column: string}
    const sqlConstraints = validationArguments.constraints[0];

    // validate against database
    const res = await RequestContext.getEntityManager()
      .getConnection()
      .execute(
        `select count(*) as ok from ${sqlConstraints.table} where ${sqlConstraints.column} = ?;`,
        [data],
      );

    if (res[0].ok === '0') {
      throw new RuntimeException(
        HttpStatus.BAD_REQUEST,
        `Validation Error: ${validationArguments.property} with value ${validationArguments.value} doesnot exists`,
        [sqlConstraints.table],
      );
    } else {
      return true;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Given data: - ${validationArguments.value} - doesnot exists`;
  }
}

export const ValidateIfNepaliScript = (
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidateIfNepaliScript',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateIfNepaliScriptConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'ValidateIfNepaliScriptConstraint', async: true })
class ValidateIfNepaliScriptConstraint implements ValidatorConstraintInterface {
  async validate(
    data,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    // validate if nepali script

    const pattern = /^[\u0900-\u097F]+$/;
    const flag = data.match(pattern);

    if (flag) {
      return true;
    } else {
      throw new RuntimeException(
        HttpStatus.BAD_REQUEST,
        'Invalid %s! Only Nepali/Devnagiri script is acceptable',
        'script',
      );
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Invalid phone number: ${validationArguments.value}`;
  }
}
