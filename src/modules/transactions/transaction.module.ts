import { CategoryRepository } from '@modules/categories/category.repository';
import { CategoryValidatorConstraint } from 'src/validators/category-validator';
import { Module } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [
    TransactionService,
    TransactionRepository,
    CategoryValidatorConstraint,
    CategoryRepository,
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
