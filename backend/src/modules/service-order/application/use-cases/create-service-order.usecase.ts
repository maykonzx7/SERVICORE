import { Injectable, Inject, Optional } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { ServiceOrderRepository } from "../../domain/repositories/service-order.repository";
import { ServiceOrder } from "../../domain/entities/service-order";
import { CompanyId } from "../../domain/value-objects/company-id";
import { Priority } from "../../domain/value-objects/priority";
import { Money } from "../../domain/value-objects/money";
import { ServiceOrderCreatedEvent } from "../../domain/events/service-order-created.event";

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
  constructor(
    private readonly repository: ServiceOrderRepository,
    @Inject("ServiceOrderCreatedHandler")
    @Optional()
    private readonly serviceOrderCreatedHandler?: any
  ) {
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

      // Processar eventos de domínio (criar transação automaticamente)
      const events = serviceOrder.domainEvents;
      for (const event of events) {
        if (event instanceof ServiceOrderCreatedEvent) {
          // Chamar handler para criar transação automaticamente
          if (this.serviceOrderCreatedHandler) {
            await this.serviceOrderCreatedHandler.handle(event).catch((err: any) => {
              // Log do erro mas não interrompe o fluxo
              console.error("Erro ao criar transação para ordem de serviço:", err);
            });
          }
        }
      }
      serviceOrder.clearDomainEvents();

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
