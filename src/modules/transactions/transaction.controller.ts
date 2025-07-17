import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';

import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetUser } from '@modules/auth/get-user.decorator';
import { User } from '@modules/auth/user.entity';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  private logger = new Logger('TransactionController');
  constructor(private transactionService: TransactionService) {}

  @Get()
  getTransactions(@GetUser() user: User): Promise<Transaction[]> {
    this.logger.verbose(`User ${user.email} retrieving all transactions...`);

    return this.transactionService.getTransactions(user);
  }

  @Get('/:id')
  getTransactionById(@Param('id') id: string, @GetUser() user: User): Promise<Transaction> {
    this.logger.verbose(`User ${user.email} retrieving transaction by id...`);

    return this.transactionService.getTransactionById(id, user);
  }

  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDto, @GetUser() user: User) {
    this.logger.verbose(`Creating a new transaction with title: ${createTransactionDto.title}`);

    return this.transactionService.createTransaction(createTransactionDto, user);
  }

  @Put('/:id')
  updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @GetUser() user: User,
  ): Promise<Transaction> {
    this.logger.verbose(`Updating transaction ${id} for user ${user.id}...`);

    return this.transactionService.updateTransaction(id, updateTransactionDto, user);
  }

  @Delete('/:id')
  deleteTransaction(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`Deleting transaction (ID: ${id}) from user: ${user.email}`);

    return this.transactionService.deleteTransaction(id, user);
  }
}
