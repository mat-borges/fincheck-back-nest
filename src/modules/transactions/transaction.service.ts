import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CategoryRepository } from '@modules/categories/category.repository';
import { User } from '@modules/auth/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository,

    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  getTransactions(user: User): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions(user);
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const { categoryId } = createTransactionDto;

    const category = await this.categoryRepository.getCategoryById(categoryId);

    if (!category) {
      throw new Error(`Category with ID ${categoryId} does not exist.`);
    }

    const transaction = this.transactionRepository.createTransaction(createTransactionDto, user);

    return transaction;
  }
}
