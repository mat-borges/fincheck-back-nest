import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CategoryRepository } from '@modules/categories/category.repository';
import { User } from '@modules/auth/user.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

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

  getTransactionById(id: string, user: User): Promise<Transaction> {
    return this.transactionRepository.getTransactionById(id, user);
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

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    return await this.transactionRepository.updateTransaction(id, updateTransactionDto, user);
  }

  async deleteTransaction(id: string, user: User): Promise<void> {
    await this.transactionRepository.deleteTransaction(id, user);
  }
}
