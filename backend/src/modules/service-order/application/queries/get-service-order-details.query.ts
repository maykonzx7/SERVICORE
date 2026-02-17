import { Injectable } from "@nestjs/common";
import { BaseQuery } from "@shared/application/base-query";
import { ServiceOrderQueryServiceInterface } from "./service-order-query.service.interface";
import { ServiceOrderReadDto } from "./dto/service-order-read.dto";

export interface GetServiceOrderDetailsInput {
  id: string;
}

@Injectable()
export class GetServiceOrderDetailsQuery extends BaseQuery<
  GetServiceOrderDetailsInput,
  ServiceOrderReadDto | null
> {
  constructor(
    private readonly queryService: ServiceOrderQueryServiceInterface
  ) {
    super();
  }

  async execute(
    input: GetServiceOrderDetailsInput
  ): Promise<ServiceOrderReadDto | null> {
    return this.queryService.findById(input.id);
  }
}
