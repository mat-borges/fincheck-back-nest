import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { CategoryRepository } from '@modules/categories/category.repository';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class CategoryValidatorConstraint implements ValidatorConstraintInterface {
  constructor(private categoryRepository: CategoryRepository) {}

  async validate(categoryId: string): Promise<boolean> {
    const category = await this.categoryRepository.getCategoryById(categoryId);
    return !!category;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Categoria com id "${args.value}" não existe`;
  }
}

export function CategoryExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCategoryExists',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: CategoryValidatorConstraint,
    });
  };
}
