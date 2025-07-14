import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  getCategories(): Promise<Category[]> {
    return this.categoryRepository.getCategories();
  }
}
