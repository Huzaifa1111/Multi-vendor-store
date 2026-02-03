import * as mysql from 'mysql2/promise';
import { loadEnvFile } from 'process';

loadEnvFile()

export async function createDatabaseIfNotExists() {
    const dbName = process.env.DB_NAME!;


    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    try {
        // Try to check if database exists, but catch if permission denied
        try {
            const [rows] = await connection.query(
                `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
                [dbName],
            );

            if ((rows as any[]).length === 0) {
                console.log(` Creating database "${dbName}"...`);
                await connection.query(`CREATE DATABASE \`${dbName}\``);
                console.log(` Database "${dbName}" created`);
            } else {
                console.log(` Database "${dbName}" already exists`);
            }
        } catch (innerError) {
            console.warn(' Warning: Could not check or create database (might be permission issue on remote host):', innerError.message);
            console.log(' Proceeding with connection assuming database exists.');
        }
    } catch (error) {
        console.error(' Error in database setup:', error);
        // We don't necessarily want to throw here if it's just a permission issue on SCHEMATA
        // but if the initial connection failed, the app will fail later anyway.
    } finally {
        await connection.end();
    }
}

