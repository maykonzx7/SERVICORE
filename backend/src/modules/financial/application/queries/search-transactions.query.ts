import { Injectable } from "@nestjs/common";
import { BaseQuery } from "@shared/application/base-query";
import { TransactionQueryServiceInterface } from "./transaction-query.service.interface";
import { PaginatedResultDto } from "@shared/application/dto";
import { TransactionReadDto } from "./dto/transaction-read.dto";

export interface SearchTransactionsInput {
  companyId: string;
  filters: {
    type?: string;
    status?: string;
    serviceOrderId?: string;
    paymentMethod?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  };
  page: number;
  limit: number;
}

@Injectable()
export class SearchTransactionsQuery extends BaseQuery<
  SearchTransactionsInput,
  PaginatedResultDto<TransactionReadDto>
> {
  constructor(
    private readonly queryService: TransactionQueryServiceInterface
  ) {
    super();
  }

  async execute(
    input: SearchTransactionsInput
  ): Promise<PaginatedResultDto<TransactionReadDto>> {
    return this.queryService.search(
      input.companyId,
      input.filters,
      input.page,
      input.limit
    );
  }
}

