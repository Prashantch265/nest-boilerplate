import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAdminsTable1760433770065 implements MigrationInterface {
  name = 'AlterAdminsTable1760433770065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "FK_420cf6d31487d2f341b40d52e37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" RENAME COLUMN "userId" TO "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "FK_2b901dd818a2a6486994d915a68" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "FK_2b901dd818a2a6486994d915a68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" RENAME COLUMN "user_id" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "FK_420cf6d31487d2f341b40d52e37" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
