import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

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
      logUnknownError(
        this.logger,
        'get transactions',
        undefined,
        undefined,
        error,
      );
    }
  }
}
