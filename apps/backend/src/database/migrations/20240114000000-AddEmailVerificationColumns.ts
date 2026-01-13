// Example: 20240114000000-AddEmailVerificationColumns.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationColumns20240114000000 implements MigrationInterface {
    name = 'AddEmailVerificationColumns20240114000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "isEmailVerified" boolean NOT NULL DEFAULT false,
            ADD COLUMN "verificationOtp" character varying,
            ADD COLUMN "otpExpiresAt" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "isEmailVerified",
            DROP COLUMN "verificationOtp",
            DROP COLUMN "otpExpiresAt"
        `);
    }
}