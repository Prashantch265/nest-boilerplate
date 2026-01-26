import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class TimeStamp {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date; // This column will be used for soft deletes
}
