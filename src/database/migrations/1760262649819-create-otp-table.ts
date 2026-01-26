import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOtpTable1760262649819 implements MigrationInterface {
  name = 'CreateOtpTable1760262649819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."otps_status_enum" AS ENUM('PENDING', 'VERIFIED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "otp_code" character varying(6) NOT NULL, "user_id" uuid NOT NULL, "status" "public"."otps_status_enum" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "otps" ADD CONSTRAINT "FK_82b0deb105275568cdcef2823eb" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otps" DROP CONSTRAINT "FK_82b0deb105275568cdcef2823eb"`,
    );
    await queryRunner.query(`DROP TABLE "otps"`);
    await queryRunner.query(`DROP TYPE "public"."otps_status_enum"`);
  }
}
