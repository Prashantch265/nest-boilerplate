/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-03 19:39:07
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-03 19:45:49
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
