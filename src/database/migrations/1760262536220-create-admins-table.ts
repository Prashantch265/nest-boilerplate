import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminsTable1760262536220 implements MigrationInterface {
  name = 'CreateAdminsTable1760262536220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admins" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "admin_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "first_name" character varying(64) NOT NULL, "last_name" character varying(64) NOT NULL, "position" character varying(128), "contact_number" character varying(32), "userId" uuid, CONSTRAINT "REL_420cf6d31487d2f341b40d52e3" UNIQUE ("userId"), CONSTRAINT "PK_88070d08be64522fc84fdefef85" PRIMARY KEY ("admin_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "FK_420cf6d31487d2f341b40d52e37" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "FK_420cf6d31487d2f341b40d52e37"`,
    );
    await queryRunner.query(`DROP TABLE "admins"`);
  }
}
