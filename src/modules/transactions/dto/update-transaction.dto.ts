import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

import { Transform } from 'class-transformer';

export class UpdateTransactionDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => Number(value))
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNotEmpty()
  date?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  type?: 'income' | 'expense';

  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  categoryId?: string;
}
