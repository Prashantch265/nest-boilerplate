import { ToLowerCase, ToTrimmed } from '@decorators/transform-input.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUsersDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  fullName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  contact: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  @ToLowerCase()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  password: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @ToTrimmed()
  userName: string;
}

export class UpdateUsersDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  fullName?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  contact?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsEmail()
  @ToLowerCase()
  email?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  password?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ToTrimmed()
  userName?: string;
}
