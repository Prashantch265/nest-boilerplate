import PrimaryEntity from 'src/core/Common/entities/primary.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'privileges' })
export default class Privilege extends PrimaryEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'description', nullable: true })
  description: string;
}
