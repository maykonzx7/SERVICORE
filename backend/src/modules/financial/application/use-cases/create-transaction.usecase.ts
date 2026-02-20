import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { Transaction } from "../../domain/entities/transaction";
import { CompanyId } from "@modules/service-order/domain/value-objects/company-id";
import { ServiceOrderId } from "@modules/service-order/domain/value-objects/service-order-id";
import { TransactionType } from "../../domain/value-objects/transaction-type";
import { PaymentMethod } from "../../domain/value-objects/payment-method";
import { Money } from "@modules/service-order/domain/value-objects/money";

export interface CreateTransactionInput {
  companyId: string;
  type: string;
  amount: number;
  description: string;
  currency?: string;
  serviceOrderId?: string | null;
  paymentMethod?: string | null;
  dueDate?: Date | null;
}

@Injectable()
export class CreateTransactionUseCase extends BaseUseCase<
  CreateTransactionInput,
  Transaction
> {
  constructor(private readonly repository: TransactionRepository) {
    super();
  }

  async execute(
    input: CreateTransactionInput
  ): Promise<Result<Transaction>> {
    try {
      // Criar Value Objects
      const companyId = CompanyId.create(input.companyId);
      const type = TransactionType.create(input.type);
      const amount = Money.create(
        input.amount,
        input.currency || "BRL"
      );
      const serviceOrderId = input.serviceOrderId
        ? ServiceOrderId.create(input.serviceOrderId)
        : null;
      const paymentMethod = input.paymentMethod
        ? PaymentMethod.create(input.paymentMethod)
        : null;

      // Criar Aggregate
      const transaction = Transaction.create(
        companyId,
        type,
        amount,
        input.description,
        input.currency || "BRL",
        serviceOrderId,
        paymentMethod,
        input.dueDate || null
      );

      // Persistir
      await this.repository.save(transaction);

      return this.success(transaction);
    } catch (error) {
      return this.failure(
        error instanceof Error
          ? error.message
          : "Failed to create transaction"
      );
    }
  }
}

