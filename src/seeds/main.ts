import * as dotenv from 'dotenv';

import { Category } from 'src/modules/categories/category.entity';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Transaction } from '@modules/transactions/transaction.entity';
import { seedCategories } from './category.seed';

dotenv.config({
  path: `.env.stage.${process.env.STAGE || 'dev'}`,
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Category, Transaction],
  synchronize: true,
});

async function bootstrap() {
  const logger = new Logger('Seeding');

  try {
    await AppDataSource.initialize();
    await seedCategories(AppDataSource);
    await AppDataSource.destroy();
    logger.log('🌱 Seeding finished');
  } catch (err) {
    logger.error('❌ Seeding failed', err);
    process.exit(1);
  }
}

void bootstrap();
