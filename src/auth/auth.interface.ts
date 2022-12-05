/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-03 19:39:07
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 15:56:31
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginData {
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

export interface payload {
  sub: string;
  userType: userType;
  iat: number;
}

export enum userType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}
