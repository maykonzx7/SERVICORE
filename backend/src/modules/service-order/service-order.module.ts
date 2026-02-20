import { Module } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { ServiceOrderController } from "./presentation/controllers/service-order.controller";
import { ServiceOrderQueryController } from "./presentation/controllers/service-order-query.controller";
import { CreateServiceOrderUseCase } from "./application/use-cases/create-service-order.usecase";
import { StartServiceOrderUseCase } from "./application/use-cases/start-service-order.usecase";
import { CompleteServiceOrderUseCase } from "./application/use-cases/complete-service-order.usecase";
import { CancelServiceOrderUseCase } from "./application/use-cases/cancel-service-order.usecase";
import { ListServiceOrdersQuery } from "./application/queries/list-service-orders.query";
import { GetServiceOrderDetailsQuery } from "./application/queries/get-service-order-details.query";
import { PrismaServiceOrderRepository } from "./infrastructure/persistence/prisma-service-order.repository";
import { PrismaServiceOrderQueryService } from "./infrastructure/persistence/prisma-service-order.query.service";
import { ServiceOrderRepository } from "./domain/repositories/service-order.repository";
import { ServiceOrderQueryServiceInterface } from "./application/queries/service-order-query.service.interface";
import { FinancialModule } from "../financial/financial.module";

/**
 * ServiceOrderModule
 *
 * Módulo NestJS para o contexto Service Order.
 * Configura todas as dependências e injeções.
 */
@Module({
  imports: [FinancialModule],
  controllers: [ServiceOrderController, ServiceOrderQueryController],
  providers: [
    // Infrastructure
    PrismaService,
    {
      provide: "ServiceOrderRepository",
      useClass: PrismaServiceOrderRepository,
    },
    {
      provide: "ServiceOrderQueryServiceInterface",
      useClass: PrismaServiceOrderQueryService,
    },
    // Use Cases (Write Side)
    {
      provide: CreateServiceOrderUseCase,
      useFactory: (
        repository: ServiceOrderRepository,
        handler?: any
      ) => {
        return new CreateServiceOrderUseCase(repository, handler);
      },
      inject: [
        "ServiceOrderRepository",
        { token: "ServiceOrderCreatedHandler", optional: true },
      ],
    },
    {
      provide: StartServiceOrderUseCase,
      useFactory: (repository: ServiceOrderRepository) => {
        return new StartServiceOrderUseCase(repository);
      },
      inject: ["ServiceOrderRepository"],
    },
    {
      provide: CompleteServiceOrderUseCase,
      useFactory: (repository: ServiceOrderRepository) => {
        return new CompleteServiceOrderUseCase(repository);
      },
      inject: ["ServiceOrderRepository"],
    },
    {
      provide: CancelServiceOrderUseCase,
      useFactory: (repository: ServiceOrderRepository) => {
        return new CancelServiceOrderUseCase(repository);
      },
      inject: ["ServiceOrderRepository"],
    },
    // Queries (Read Side)
    {
      provide: ListServiceOrdersQuery,
      useFactory: (queryService: ServiceOrderQueryServiceInterface) => {
        return new ListServiceOrdersQuery(queryService);
      },
      inject: ["ServiceOrderQueryServiceInterface"],
    },
    {
      provide: GetServiceOrderDetailsQuery,
      useFactory: (queryService: ServiceOrderQueryServiceInterface) => {
        return new GetServiceOrderDetailsQuery(queryService);
      },
      inject: ["ServiceOrderQueryServiceInterface"],
    },
  ],
  exports: [
    // Exportar para uso em outros módulos se necessário
    "ServiceOrderRepository",
    "ServiceOrderQueryServiceInterface",
  ],
})
export class ServiceOrderModule {}
