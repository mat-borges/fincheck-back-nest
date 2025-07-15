import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from '../categories/category.entity';
import { User } from '@modules/auth/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  type!: 'income' | 'expense';

  @Column()
  categoryId!: string;

  @Column()
  userId!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column()
  date!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Category, (category) => category.transactions, {
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @ManyToOne(() => User, (user) => user.transactions, { eager: false })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
