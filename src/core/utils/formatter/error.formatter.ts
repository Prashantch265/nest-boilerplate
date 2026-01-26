import { ValidationError } from 'class-validator';
import { ValidationException } from '../../exceptions';

function format(errors: ValidationError[]): Record<string, string[]> {
  let data: Record<string, string[]> = {};
  errors.forEach((error) => {
    const response: Record<string, string[]> = {};
    if (error?.children?.length) {
      response[error.property] = Object.values(format(error.children)).flat();
    } else if (error.constraints) {
      response[error.property] = Object.values(error.constraints);
    }
    data = { ...data, ...response };
  });
  return data;
}

export function ErrorFormatter(errors: ValidationError[]) {
  throw new ValidationException('Validation failed', format(errors));
}
