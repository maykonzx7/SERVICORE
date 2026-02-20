import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsDateString,
} from "class-validator";

export class UpdateTransactionDto {
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum([
    "CASH",
    "PIX",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "BANK_TRANSFER",
    "CHECK",
    "OTHER",
  ])
  @IsOptional()
  paymentMethod?:
    | "CASH"
    | "PIX"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "BANK_TRANSFER"
    | "CHECK"
    | "OTHER"
    | null;

  @IsDateString()
  @IsOptional()
  dueDate?: Date | null;

  @IsString()
  @IsOptional()
  serviceOrderId?: string | null;
}

