import { Category } from 'src/modules/categories/category.entity';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

export const seedCategories = async (dataSource: DataSource) => {
  const categoryRepo = dataSource.getRepository(Category);
  const logger = new Logger('CategorySeeder');

  const defaultCategories = [
    'Alimentação',
    'Mercado',
    'Saúde',
    'Lazer',
    'Educação',
    'Transporte',
    'Poupança',
    'Salário',
    'Assinaturas',
    'Outros',
  ];

  for (const name of defaultCategories) {
    const exists = await categoryRepo.findOne({ where: { name } });
    if (!exists) {
      await categoryRepo.save({ name });
    }
  }

  logger.log('✅ Categories seeded');
};
