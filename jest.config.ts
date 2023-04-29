/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-29 11:21:57
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-29 11:26:02
 */

import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.{js,ts}', '!**/node_modules/**', '!**/vendor/**'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@src/(.*)': ['<rootDir>/$1'],
    '@auth/(.*)': ['<rootDir>/auth/$1'],
    '@common/(.*)': ['<rootDir>/common/$1'],
    '@config/(.*)': ['<rootDir>/config/$1'],
    '@core/(.*)': ['<rootDir>/core/$1'],
    '@database/(.*)': ['<rootDir>/database/$1'],
    '@decorators/(.*)': ['<rootDir>/decorators/$1'],
    '@exceptions/(.*)': ['<rootDir>/exceptions/$1'],
    '@filters/(.*)': ['<rootDir>/filters/$1'],
    '@guards/(.*)': ['<rootDir>/guards/$1'],
    '@interceptors/(.*)': ['<rootDir>/interceptors/$1'],
    '@mailer/(.*)': ['<rootDir>/mailer/$1'],
    '@pipe/(.*)': ['<rootDir>/pipe/$1'],
    '@strategies/(.*)': ['<rootDir>/strategies/$1'],
    '@utils/(.*)': ['<rootDir>/utils/$1'],
    '@helpers/(.*)': ['<rootDir>/helpers/$1'],
  },
  verbose: true,
};

export default config;
