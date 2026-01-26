import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { USER_STATUS } from '../../../../common/enums/users.enum';

export class UpdateAdminStatusDto {
  @ApiProperty({
    enum: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE], // Only allow active/inactive
    description: 'The new status for the admin user.',
  })
  @IsEnum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE])
  status: USER_STATUS;
}
