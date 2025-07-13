import { Module } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [],
  controllers: [],
})
export class TransactionModule {}
