import { Controller, Get, Logger } from '@nestjs/common';

import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  logger = new Logger(CategoryController.name);

  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories() {
    this.logger.verbose('Retrieving all categories');
    return this.categoryService.getCategories();
  }
}
