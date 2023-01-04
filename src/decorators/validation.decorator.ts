/*
 * @Author: prashant.chaudhary
 * @Date: 2023-01-01 22:57:37
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-02 11:31:08
 */

import { RuntimeException } from '@exceptions/runtime.exception';
import { RequestContext } from '@mikro-orm/core';
import { HttpStatus } from '@nestjs/common';
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
    if (myObject.id) {
      const result = await RequestContext.getEntityManager()
        .getConnection()
        .execute(`select * from ${table} where id = ?;`, [myObject.id]);

      const entity = result[0];

      if (entity?.id == myObject.id) return true;
    }

    // throw duplicate exception
    throw new RuntimeException(
      HttpStatus.BAD_REQUEST,
      `Validation Error: ${validationArguments.property} with value <${validationArguments.value}> already exists`,
      [table],
    );
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Given data: - ${validationArguments.value} - already exists`;
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
        `Validation Error: ${validationArguments.property} with value <${validationArguments.value}> doesnot exists`,
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
