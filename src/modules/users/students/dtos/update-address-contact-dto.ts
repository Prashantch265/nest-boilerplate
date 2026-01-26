import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  stateProvince: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  secondaryPhoneNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  whatsappNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fathersName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fathersContactNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mothersName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mothersContactNumber: string;
}
