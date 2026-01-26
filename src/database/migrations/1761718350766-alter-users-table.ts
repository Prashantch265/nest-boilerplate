import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUsersTable1761718350766 implements MigrationInterface {
  name = 'AlterUsersTable1761718350766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_login_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login_at"`);
  }
}
