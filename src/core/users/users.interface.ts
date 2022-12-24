import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsersDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  contact: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  userName: string;
}
