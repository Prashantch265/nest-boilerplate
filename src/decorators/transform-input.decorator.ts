/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 22:43:03
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:19:43
 */

import { Transform } from 'class-transformer';

export const ToUpperCase = () => {
  return Transform((params) => {
    return params?.value?.toUpperCase().trim();
  }, {});
};

export const ToLowerCase = () => {
  return Transform((params) => params?.value?.toLowerCase().trim());
};

export const ToTrimmed = () => {
  return Transform((params) => params?.value?.trim(), {});
};

export const NullIfEmptyString = () => {
  return Transform(
    (params) => (params?.value === '' ? null : params?.value),
    {},
  );
};

export const ToEncodeToBase64 = () => {
  return Transform((params) => {
    const base64encoded = Buffer.from(params.value).toString('base64');
    return base64encoded;
  });
};

export const ToDecodeFromBase64 = () => {
  return Transform((params) => {
    const base64decoded = Buffer.from(params.value, 'base64').toString('ascii');
    return base64decoded;
  });
};

export const ToBooleanFromValue = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToBoolean(obj[key]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const valueToBoolean = (value: any) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false;
  }
  return undefined;
};
