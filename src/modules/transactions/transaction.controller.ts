import { Controller, Get, Logger } from '@nestjs/common';

import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  private logger = new Logger('TransactionController');
  constructor(private transactionService: TransactionService) {}

  @Get()
  getTransactions(): Promise<Transaction[]> {
    this.logger.verbose('Retrieving all transactions');

    return this.transactionService.getTransactions();
  }
}
