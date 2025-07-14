import { Body, Controller, Get, Logger, Post } from '@nestjs/common';

import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  private logger = new Logger('TransactionController');
  constructor(private transactionService: TransactionService) {}

  @Get()
  getTransactions(): Promise<Transaction[]> {
    this.logger.verbose('Retrieving all transactions');

    return this.transactionService.getTransactions();
  }

  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    this.logger.verbose(`Creating a new transaction with title: ${createTransactionDto.title}`);

    return this.transactionService.createTransaction(createTransactionDto);
  }
}
