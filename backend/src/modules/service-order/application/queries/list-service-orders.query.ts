import { Injectable } from "@nestjs/common";
import { BaseQuery } from "@shared/application/base-query";
import { ServiceOrderQueryServiceInterface } from "./service-order-query.service.interface";
import { PaginatedResultDto } from "@shared/application/dto";
import { ServiceOrderReadDto } from "./dto/service-order-read.dto";

export interface ListServiceOrdersInput {
  companyId: string;
  page: number;
  limit: number;
}

@Injectable()
export class ListServiceOrdersQuery extends BaseQuery<
  ListServiceOrdersInput,
  PaginatedResultDto<ServiceOrderReadDto>
> {
  constructor(
    private readonly queryService: ServiceOrderQueryServiceInterface
  ) {
    super();
  }

  async execute(
    input: ListServiceOrdersInput
  ): Promise<PaginatedResultDto<ServiceOrderReadDto>> {
    return this.queryService.findByCompanyId(
      input.companyId,
      input.page,
      input.limit
    );
  }
}
