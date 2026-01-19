import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationColumns1712345678901 implements MigrationInterface {
    name = 'AddEmailVerificationColumns1712345678901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Try to add columns, ignore errors if they already exist
        try {
            await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isEmailVerified" boolean DEFAULT false`);
        } catch (error) {
            console.log('Column isEmailVerified might already exist:', error.message);
        }
        
        try {
            await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verificationOtp" character varying`);
        } catch (error) {
            console.log('Column verificationOtp might already exist:', error.message);
        }
        
        try {
            await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otpExpiresAt" TIMESTAMP`);
        } catch (error) {
            console.log('Column otpExpiresAt might already exist:', error.message);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN IF EXISTS "isEmailVerified",
            DROP COLUMN IF EXISTS "verificationOtp",
            DROP COLUMN IF EXISTS "otpExpiresAt"
        `);
    }
}