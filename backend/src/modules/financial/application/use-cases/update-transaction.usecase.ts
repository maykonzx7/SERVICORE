import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { TransactionId } from "../../domain/value-objects/transaction-id";
import { ServiceOrderId } from "@modules/service-order/domain/value-objects/service-order-id";
import { PaymentMethod } from "../../domain/value-objects/payment-method";
import { Money } from "@modules/service-order/domain/value-objects/money";

export interface UpdateTransactionInput {
  id: string;
  amount?: number;
  description?: string;
  paymentMethod?: string | null;
  dueDate?: Date | null;
  serviceOrderId?: string | null;
}

@Injectable()
export class UpdateTransactionUseCase extends BaseUseCase<
  UpdateTransactionInput,
  void
> {
  constructor(private readonly repository: TransactionRepository) {
    super();
  }

  async execute(
    input: UpdateTransactionInput
  ): Promise<Result<void>> {
    try {
      const transactionId = TransactionId.create(input.id);
      const transaction = await this.repository.findById(transactionId);

      if (!transaction) {
        return this.failure("Transaction not found");
      }

      // Atualizar campos se fornecidos
      if (input.amount !== undefined) {
        const amount = Money.create(
          input.amount,
          transaction.currency
        );
        transaction.updateAmount(amount);
      }

      if (input.description) {
        transaction.updateDescription(input.description);
      }

      if (input.paymentMethod !== undefined) {
        const paymentMethod = input.paymentMethod
          ? PaymentMethod.create(input.paymentMethod)
          : null;
        transaction.updatePaymentMethod(paymentMethod);
      }

      if (input.dueDate !== undefined) {
        transaction.updateDueDate(input.dueDate || null);
      }

      if (input.serviceOrderId !== undefined) {
        const serviceOrderId = input.serviceOrderId
          ? ServiceOrderId.create(input.serviceOrderId)
          : null;
        transaction.updateServiceOrderId(serviceOrderId);
      }

      await this.repository.save(transaction);

      return this.success(undefined);
    } catch (error) {
      return this.failure(
        error instanceof Error
          ? error.message
          : "Failed to update transaction"
      );
    }
  }
}

