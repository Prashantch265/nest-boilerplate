import { MigrationInterface, QueryRunner } from "typeorm";

export class test1669650118342 implements MigrationInterface {
    name = 'test1669650118342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."external_users_otp_type_enum" AS ENUM('web', 'mobile')`);
        await queryRunner.query(`CREATE TABLE "external_users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_name" character varying NOT NULL, "email" character varying, "provider" character varying, "password" character varying, "otp" character varying, "otp_expiration_time" TIMESTAMP, "email_otp_verified" boolean NOT NULL DEFAULT false, "sms_otp_verified" boolean NOT NULL DEFAULT false, "otp_type" "public"."external_users_otp_type_enum" NOT NULL DEFAULT 'web', "token" character varying, CONSTRAINT "PK_ce05b71b020ea87f6163e2df160" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_name" character varying NOT NULL, "email" character varying, "password" character varying, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otp_configuration_type_enum" AS ENUM('web', 'mobile')`);
        await queryRunner.query(`CREATE TABLE "otp_configuration" ("created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "created_by" uuid, "updated_by" uuid, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "is_permanent" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "otp_length" integer NOT NULL, "expiration_time" character varying NOT NULL, "alphabets" boolean NOT NULL DEFAULT false, "uppercase" boolean NOT NULL DEFAULT false, "special_char" boolean NOT NULL DEFAULT false, "type" "public"."otp_configuration_type_enum" NOT NULL DEFAULT 'web', CONSTRAINT "PK_4fa7d85c03c59407cf1e9a65136" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "otp_configuration"`);
        await queryRunner.query(`DROP TYPE "public"."otp_configuration_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "external_users"`);
        await queryRunner.query(`DROP TYPE "public"."external_users_otp_type_enum"`);
    }

}
