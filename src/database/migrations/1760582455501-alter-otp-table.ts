import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOtpTable1760582455501 implements MigrationInterface {
  name = 'AlterOtpTable1760582455501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otps" DROP CONSTRAINT "FK_82b0deb105275568cdcef2823eb"`,
    );
    await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "otps" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "otps" ADD CONSTRAINT "FK_3938bb24b38ad395af30230bded" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otps" DROP CONSTRAINT "FK_3938bb24b38ad395af30230bded"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otps" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "otps" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "otps" ADD CONSTRAINT "FK_82b0deb105275568cdcef2823eb" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
