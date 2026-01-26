import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAdminsTable1760352978639 implements MigrationInterface {
  name = 'AlterAdminsTable1760352978639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "user_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admins" ADD "user_id" uuid NOT NULL`);
  }
}
