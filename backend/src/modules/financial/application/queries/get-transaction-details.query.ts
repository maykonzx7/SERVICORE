import { Injectable } from "@nestjs/common";
import { BaseQuery } from "@shared/application/base-query";
import { TransactionQueryServiceInterface } from "./transaction-query.service.interface";
import { TransactionReadDto } from "./dto/transaction-read.dto";

export interface GetTransactionDetailsInput {
  id: string;
}

@Injectable()
export class GetTransactionDetailsQuery extends BaseQuery<
  GetTransactionDetailsInput,
  TransactionReadDto | null
> {
  constructor(
    private readonly queryService: TransactionQueryServiceInterface
  ) {
    super();
  }

  async execute(
    input: GetTransactionDetailsInput
  ): Promise<TransactionReadDto | null> {
    return this.queryService.findById(input.id);
  }
}

