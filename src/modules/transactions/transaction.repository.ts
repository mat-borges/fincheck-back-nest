import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '@modules/auth/user.entity';
import { logUnknownError } from 'src/common/utils/log-error.util';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  private logger = new Logger(TransactionRepository.name);
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getTransactions(user: User): Promise<Transaction[]> {
    try {
      const transactions = await this.find({ where: { user: { id: user.id } } });

      this.logger.verbose(`✅ Transactions retrieved for user ${user.id}!`);
      return transactions;
    } catch (error) {
      this.logger.error(`‼️ Failed to retrieve transactions for user ${user.id}!`);
      logUnknownError(this.logger, 'get transactions', undefined, undefined, error);
    }
  }

  async getTransactionById(id: string, user: User): Promise<Transaction> {
    try {
      const transaction = await this.findOne({ where: { user: { id: user.id }, id } });

      if (!transaction) {
        this.logger.error(`‼️ Failed to retrieve transaction for user ${user.id}!`);
        throw new NotFoundException('No transaction found with this ID');
      }

      this.logger.verbose(`✅ Transaction retrieved for user ${user.id}!`);
      return transaction;
    } catch (error) {
      logUnknownError(this.logger, 'get transaction by ID', user, undefined, error);
    }
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
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

      this.logger.verbose(`✅🆕 Transaction created for user ${user.id}!`);

      return transaction;
    } catch (error) {
      this.logger.error(`‼️ Failed to create transaction for user ${user.id}! `);
      logUnknownError(this.logger, 'create transaction', undefined, undefined, error);
    }
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const { title, description, amount, date, categoryId, type } = updateTransactionDto;

    const transaction = await this.findOne({ where: { id, userId: user.id } });

    if (!transaction)
      throw new NotFoundException(`Transaction with ID: ${id} for user ${user.id} not found!`);

    transaction.title = title ?? transaction.title;
    transaction.description = description ?? transaction.description;
    transaction.amount = amount ?? transaction.amount;
    transaction.date = date ?? transaction.date;
    transaction.type = type ?? transaction.type;
    transaction.categoryId = categoryId ?? transaction.categoryId;

    try {
      await this.save(transaction);
      this.logger.verbose(`✅✏️ Transaction (ID: ${id}) updated for user ${user.id}!`);

      return transaction;
    } catch (error) {
      logUnknownError(
        this.logger,
        'update transaction',
        { email: user.email },
        { transactionId: id },
        error,
      );
    }
  }

  async deleteTransaction(id: string, user: User): Promise<void> {
    try {
      const res = await this.delete({ id, user: { id: user.id } });

      if (res.affected === 0) {
        throw new NotFoundException(`✅ Transaction (ID: ${id}) for user ${user.id} not found.`);
      } else {
        this.logger.verbose(`✅ 🗑️ Transaction (ID: ${id}) deleted for user ${user.id}!`);
      }
    } catch (error) {
      logUnknownError(
        this.logger,
        'delete transaction',
        { email: user.email },
        { transactionId: id },
        error,
      );
    }
  }
}
