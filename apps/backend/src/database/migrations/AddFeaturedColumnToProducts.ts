import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeaturedColumnToProducts1700000000000 implements MigrationInterface {
    name = 'AddFeaturedColumnToProducts1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Use PostgreSQL's ADD COLUMN IF NOT EXISTS with exception handling
        await queryRunner.query(`
            DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT FALSE;
                EXCEPTION
                    WHEN duplicate_column THEN 
                    RAISE NOTICE 'column featured already exists in products';
                END;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE products 
            DROP COLUMN IF EXISTS featured
        `);
    }
}