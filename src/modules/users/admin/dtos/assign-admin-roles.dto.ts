import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AssignAdminRolesDto {
  @ApiProperty({
    description: 'Array of role IDs to assign. Replaces existing roles.',
    example: ['uuid-role-1', 'uuid-role-2'],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  roleIds: string[];
}
