/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-03 19:39:07
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-25 23:23:50
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDataDto {
  @ApiProperty({ type: String, description: 'Registered Email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ type: String, description: 'User Password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface payloadDto {
  sub: string;
  userType: userType;
  iat: number;
}

export enum userType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export interface OauthUserDto {
  sub: number;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  picture?: string;
  provider: string;
  accessToken: string;
  refreshToken?: string;
}

export class RegisterUserDto {
  @ApiProperty({ type: String, description: 'firstName' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ type: String, description: 'lastName' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ type: String, description: 'userName' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ type: String, description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'password' })
  @IsNotEmpty()
  @IsString()
  // @MinLength(6)
  password: string;
}
