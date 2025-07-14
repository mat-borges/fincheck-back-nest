import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { Category } from '@modules/categories/category.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { logUnknownError } from 'src/common/utils/log-error.util';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  private logger = new Logger(TransactionRepository.name);
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getTransactions(): Promise<Transaction[]> {
    this.logger.verbose('Retrieving all transactions');

    try {
      const transactions = await this.find();

      return transactions;
    } catch (error) {
      logUnknownError(this.logger, 'get transactions', undefined, undefined, error);
    }
  }

  async createTransaction(createTransactionDto: CreateTransactionDto, category: Category): Promise<Transaction> {
    const { title, amount, date, categoryId, type } = createTransactionDto;

    const transaction = this.create({ title, amount, date, categoryId, category, type });

    try {
      await this.save(transaction);

      return transaction;
    } catch (error) {
      logUnknownError(this.logger, 'create transaction', undefined, undefined, error);
    }
  }
}
