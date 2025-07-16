import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { Category } from '@modules/categories/category.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { User } from '@modules/auth/user.entity';
import { logUnknownError } from 'src/common/utils/log-error.util';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  private logger = new Logger(TransactionRepository.name);
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getTransactions(user: User): Promise<Transaction[]> {
    this.logger.verbose('Retrieving all transactions');

    try {
      const transactions = await this.find({ where: { user: { id: user.id } } });

      return transactions;
    } catch (error) {
      logUnknownError(this.logger, 'get transactions', undefined, undefined, error);
    }
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    category: Category,
    user: User,
  ): Promise<Transaction> {
    const { title, description, amount, date, categoryId, type } = createTransactionDto;

    const transaction = this.create({
      title,
      description,
      amount,
      date,
      type,
      categoryId,
      userId: user.id,
    });

    try {
      await this.save(transaction);

      return transaction;
    } catch (error) {
      logUnknownError(this.logger, 'create transaction', undefined, undefined, error);
    }
  }
}
