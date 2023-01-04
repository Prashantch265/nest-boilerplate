import { Migration } from '@mikro-orm/migrations';

export class Migration20230104144312 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "otp_configurations" drop constraint if exists "otp_configurations_type_check";');

    this.addSql('alter table "otp_configurations" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "otp_configurations" add constraint "otp_configurations_type_check" check ("type" in (\'web\', \'mobile\'));');
    this.addSql('alter table "otp_configurations" alter column "type" set default \'web\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "otp_configurations" drop constraint if exists "otp_configurations_type_check";');

    this.addSql('alter table "otp_configurations" alter column "type" drop default;');
    this.addSql('alter table "otp_configurations" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "otp_configurations" add constraint "otp_configurations_type_check" check ("type" in (\'web\', \'mobile\'));');
  }

}
