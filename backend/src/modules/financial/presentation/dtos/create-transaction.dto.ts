import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Min,
  IsDateString,
} from "class-validator";

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsEnum(["INCOME", "EXPENSE"])
  @IsNotEmpty()
  type: "INCOME" | "EXPENSE";

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  serviceOrderId?: string | null;

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
}

