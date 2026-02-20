import { Injectable } from "@nestjs/common";
import { BaseQuery } from "@shared/application/base-query";
import { TransactionQueryServiceInterface } from "./transaction-query.service.interface";
import { PaginatedResultDto } from "@shared/application/dto";
import { TransactionReadDto } from "./dto/transaction-read.dto";

export interface ListTransactionsInput {
  companyId: string;
  page: number;
  limit: number;
}

@Injectable()
export class ListTransactionsQuery extends BaseQuery<
  ListTransactionsInput,
  PaginatedResultDto<TransactionReadDto>
> {
  constructor(
    private readonly queryService: TransactionQueryServiceInterface
  ) {
    super();
  }

  async execute(
    input: ListTransactionsInput
  ): Promise<PaginatedResultDto<TransactionReadDto>> {
    return this.queryService.findByCompanyId(
      input.companyId,
      input.page,
      input.limit
    );
  }
}

