import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { Transform } from 'class-transformer';

export class CreateTransactionDto {
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => Number(value))
  @IsNumber()
  amount!: number;

  @IsNotEmpty()
  date!: string;

  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  type!: 'income' | 'expense';

  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}
