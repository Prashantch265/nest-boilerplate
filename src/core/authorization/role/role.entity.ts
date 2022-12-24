import PrimaryEntity from 'src/core/Common/entities/primary.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'roles' })
export default class Role extends PrimaryEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'description', nullable: true })
  description: string;
}
