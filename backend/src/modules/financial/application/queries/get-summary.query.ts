import { Injectable } from "@nestjs/common";
import { BaseQuery } from "@shared/application/base-query";
import { TransactionQueryServiceInterface } from "./transaction-query.service.interface";

export interface GetSummaryInput {
  companyId: string;
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class GetSummaryQuery extends BaseQuery<
  GetSummaryInput,
  {
    companyId: string;
    period: { startDate: Date; endDate: Date };
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    pendingIncome: number;
    pendingExpense: number;
    transactionsCount: number;
    currency: string;
  }
> {
  constructor(
    private readonly queryService: TransactionQueryServiceInterface
  ) {
    super();
  }

  async execute(input: GetSummaryInput) {
    return this.queryService.getSummary(
      input.companyId,
      input.startDate,
      input.endDate
    );
  }
}

