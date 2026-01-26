import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'An array of permission IDs to assign to the role',
    example: ['uuid-for-user-view', 'uuid-for-application-edit'],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}
