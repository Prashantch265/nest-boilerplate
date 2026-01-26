import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentModuleTables1760262749783
  implements MigrationInterface
{
  name = 'CreateStudentModuleTables1760262749783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."student_education_backgrounds_marking_system_enum" AS ENUM('GPA', 'PERCENTAGE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "student_education_backgrounds" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" character varying NOT NULL, "education_level" character varying(128) NOT NULL, "program_stream" character varying(255) NOT NULL, "program_name" character varying(255) NOT NULL, "country_of_study" character varying(128) NOT NULL, "board_university" character varying(255) NOT NULL, "institution_name" character varying(255) NOT NULL, "graduation_year" character varying(4) NOT NULL, "grade" character varying(10) NOT NULL, "marking_system" "public"."student_education_backgrounds_marking_system_enum" NOT NULL, "transcript_url" character varying(255), "certificate_url" character varying(255), "studentId" uuid, CONSTRAINT "PK_95edfdb4eb801885c8b91534477" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."student_test_scores_english_test_type_enum" AS ENUM('IELTS', 'TOEFL', 'PTE', 'DUOLINGO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."student_test_scores_korean_test_type_enum" AS ENUM('TOPIK', 'KLAT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "student_test_scores" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" character varying NOT NULL, "english_test_type" "public"."student_test_scores_english_test_type_enum", "english_test_score" character varying(10), "english_test_date" date, "english_test_report_url" character varying(255), "korean_test_type" "public"."student_test_scores_korean_test_type_enum", "korean_test_score" character varying(10), "korean_test_date" date, "korean_test_report_url" character varying(255), "studentId" uuid, CONSTRAINT "PK_632b8e577f2e59d342c249d27b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "student_visa_histories" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" character varying NOT NULL, "has_been_denied" boolean NOT NULL DEFAULT false, "visa_type" character varying(128), "application_year" character varying(4), "reason_for_denial" text, "additional_notes" text, "studentId" uuid, CONSTRAINT "PK_8365dca1b4a7efc04a6de6206eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."students_gender_enum" AS ENUM('Male', 'Female', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "students" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "student_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "profile_completion_step" integer NOT NULL DEFAULT '0', "photo_url" character varying, "first_name" character varying(64), "middle_name" character varying(64), "last_name" character varying(64), "date_of_birth" date, "gender" "public"."students_gender_enum", "country_of_citizenship" character varying(128), "passport_number" character varying(64), "passport_expiry_date" date, "passport_file_url" character varying, "country" character varying(128), "state_province" character varying(128), "city" character varying(128), "address" character varying(255), "postal_code" character varying(32), "phone_number" character varying(32), "secondary_phone_number" character varying(32), "whatsapp_number" character varying(32), "fathers_name" character varying(128), "fathers_contact_number" character varying(32), "mothers_name" character varying(128), "mothers_contact_number" character varying(32), "userId" uuid, CONSTRAINT "REL_e0208b4f964e609959aff431bf" UNIQUE ("userId"), CONSTRAINT "PK_ba36f3e3743f80d1cdc51020103" PRIMARY KEY ("student_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_education_backgrounds" ADD CONSTRAINT "FK_098cfe4ca4d18bcce7dd175ceb0" FOREIGN KEY ("studentId") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_test_scores" ADD CONSTRAINT "FK_1520cf56f76fc2d502835b58ede" FOREIGN KEY ("studentId") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_visa_histories" ADD CONSTRAINT "FK_52958993e6f82d03c9d7b0dcf23" FOREIGN KEY ("studentId") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "FK_e0208b4f964e609959aff431bf9" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_e0208b4f964e609959aff431bf9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_visa_histories" DROP CONSTRAINT "FK_52958993e6f82d03c9d7b0dcf23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_test_scores" DROP CONSTRAINT "FK_1520cf56f76fc2d502835b58ede"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_education_backgrounds" DROP CONSTRAINT "FK_098cfe4ca4d18bcce7dd175ceb0"`,
    );
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TYPE "public"."students_gender_enum"`);
    await queryRunner.query(`DROP TABLE "student_visa_histories"`);
    await queryRunner.query(`DROP TABLE "student_test_scores"`);
    await queryRunner.query(
      `DROP TYPE "public"."student_test_scores_korean_test_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."student_test_scores_english_test_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "student_education_backgrounds"`);
    await queryRunner.query(
      `DROP TYPE "public"."student_education_backgrounds_marking_system_enum"`,
    );
  }
}
