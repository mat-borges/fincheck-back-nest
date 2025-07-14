import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  title!: string;

  description?: string;

  @IsNotEmpty()
  amount!: number;

  @IsNotEmpty()
  date!: string;

  @IsNotEmpty()
  type!: 'income' | 'expense';

  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}
