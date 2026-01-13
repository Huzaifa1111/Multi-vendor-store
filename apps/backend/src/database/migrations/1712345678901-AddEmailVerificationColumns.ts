// Create a new migration file in apps/backend/src/database/migrations/
// Name: 1712345678901-AddEmailVerificationColumns.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationColumns1712345678901 implements MigrationInterface {
    name = 'AddEmailVerificationColumns1712345678901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "isEmailVerified" boolean DEFAULT false,
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