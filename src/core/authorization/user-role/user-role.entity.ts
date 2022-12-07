import PrimaryEntity from 'src/core/Common/entities/primary.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user-role' })
export default class UserRole extends PrimaryEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'role_code' })
  roleCode: string;
}
