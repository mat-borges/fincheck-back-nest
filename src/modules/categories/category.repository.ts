import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Category } from './category.entity';
import { logUnknownError } from 'src/common/utils/log-error.util';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  private logger = new Logger(CategoryRepository.name);
  constructor(dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async getCategories(): Promise<Category[]> {
    try {
      const category = await this.find();

      if (category.length <= 0 || !category) throw new NotFoundException('No categories found!');

      this.logger.verbose('✅ Categories retrieved!');
      return category;
    } catch (error) {
      logUnknownError(this.logger, 'get category', undefined, undefined, error);
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    this.logger.verbose(`Retrieving category with id: ${id}`);

    try {
      const category = await this.findOneBy({ id });

      if (!category) {
        this.logger.warn(`Category with id ${id} not found`);
        return null;
      }

      return category;
    } catch (error) {
      logUnknownError(this.logger, 'get category by id', undefined, undefined, error);
    }
  }
}
