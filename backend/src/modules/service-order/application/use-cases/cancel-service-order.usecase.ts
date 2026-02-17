import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { ServiceOrderRepository } from "../../domain/repositories/service-order.repository";
import { ServiceOrder } from "../../domain/entities/service-order";
import { ServiceOrderId } from "../../domain/value-objects/service-order-id";

export interface CancelServiceOrderInput {
  serviceOrderId: string;
}

@Injectable()
export class CancelServiceOrderUseCase extends BaseUseCase<
  CancelServiceOrderInput,
  ServiceOrder
> {
  constructor(private readonly repository: ServiceOrderRepository) {
    super();
  }

  async execute(input: CancelServiceOrderInput): Promise<Result<ServiceOrder>> {
    try {
      const id = ServiceOrderId.create(input.serviceOrderId);

      // Buscar aggregate
      const serviceOrder = await this.repository.findById(id);
      if (!serviceOrder) {
        return this.failure("Service order not found");
      }

      // Executar ação de domínio
      serviceOrder.cancel();

      // Persistir
      await this.repository.save(serviceOrder);

      return this.success(serviceOrder);
    } catch (error) {
      return this.failure(
        error instanceof Error
          ? error.message
          : "Failed to cancel service order"
      );
    }
  }
}
