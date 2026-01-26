import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Consultancy Manager',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'A clear description of what the role is for.',
    example:
      'Manages all students and applications for a specific consultancy.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
