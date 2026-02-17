import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { ServiceOrderRepository } from "../../domain/repositories/service-order.repository";
import { ServiceOrder } from "../../domain/entities/service-order";
import { CompanyId } from "../../domain/value-objects/company-id";
import { Priority } from "../../domain/value-objects/priority";
import { Money } from "../../domain/value-objects/money";

export interface CreateServiceOrderInput {
  companyId: string;
  description: string;
  priority: string;
  value: number;
}

@Injectable()
export class CreateServiceOrderUseCase extends BaseUseCase<
  CreateServiceOrderInput,
  ServiceOrder
> {
  constructor(private readonly repository: ServiceOrderRepository) {
    super();
  }

  async execute(input: CreateServiceOrderInput): Promise<Result<ServiceOrder>> {
    try {
      // Criar Value Objects
      const companyId = CompanyId.create(input.companyId);
      const priority = Priority.create(input.priority);
      const money = Money.create(input.value);

      // Criar Aggregate
      const serviceOrder = ServiceOrder.create(
        companyId,
        input.description,
        priority,
        money
      );

      // Persistir
      await this.repository.save(serviceOrder);

      return this.success(serviceOrder);
    } catch (error) {
      return this.failure(
        error instanceof Error
          ? error.message
          : "Failed to create service order"
      );
    }
  }
}
