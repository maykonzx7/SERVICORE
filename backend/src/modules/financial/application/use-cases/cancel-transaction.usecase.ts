import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { TransactionId } from "../../domain/value-objects/transaction-id";

export interface CancelTransactionInput {
  id: string;
}

@Injectable()
export class CancelTransactionUseCase extends BaseUseCase<
  CancelTransactionInput,
  void
> {
  constructor(private readonly repository: TransactionRepository) {
    super();
  }

  async execute(
    input: CancelTransactionInput
  ): Promise<Result<void>> {
    try {
      const transactionId = TransactionId.create(input.id);
      const transaction = await this.repository.findById(transactionId);

      if (!transaction) {
        return this.failure("Transaction not found");
      }

      transaction.cancel();
      await this.repository.save(transaction);

      return this.success(undefined);
    } catch (error) {
      return this.failure(
        error instanceof Error
          ? error.message
          : "Failed to cancel transaction"
      );
    }
  }
}

