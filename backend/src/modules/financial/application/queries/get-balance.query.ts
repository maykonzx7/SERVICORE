import { Injectable } from "@nestjs/common";
import { BaseQuery } from "@shared/application/base-query";
import { TransactionQueryServiceInterface } from "./transaction-query.service.interface";

export interface GetBalanceInput {
  companyId: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class GetBalanceQuery extends BaseQuery<
  GetBalanceInput,
  {
    companyId: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    currency: string;
    period?: { startDate: Date; endDate: Date };
  }
> {
  constructor(
    private readonly queryService: TransactionQueryServiceInterface
  ) {
    super();
  }

  async execute(input: GetBalanceInput) {
    return this.queryService.getBalance(
      input.companyId,
      input.startDate,
      input.endDate
    );
  }
}

