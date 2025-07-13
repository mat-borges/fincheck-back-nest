import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Exclude } from 'class-transformer';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Transaction, (transaction) => transaction.category, {
    eager: false,
    nullable: false,
  })
  @Exclude({ toPlainOnly: true })
  transactions!: Transaction[];
}
