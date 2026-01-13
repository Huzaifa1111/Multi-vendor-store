// apps/backend/src/database/typeorm.config.ts - UPDATED
import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Product } from '../modules/products/product.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin', // Changed from DB_PASS to DB_PASSWORD
  database: process.env.DB_NAME || 'store_db',
  entities: [
    User,
    Product,
  ],
  synchronize: true,
};