import { Module } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { TransactionController } from "./presentation/controllers/transaction.controller";
import { TransactionQueryController } from "./presentation/controllers/transaction-query.controller";
import { CreateTransactionUseCase } from "./application/use-cases/create-transaction.usecase";
import { UpdateTransactionUseCase } from "./application/use-cases/update-transaction.usecase";
import { ApproveTransactionUseCase } from "./application/use-cases/approve-transaction.usecase";
import { RejectTransactionUseCase } from "./application/use-cases/reject-transaction.usecase";
import { ProcessTransactionUseCase } from "./application/use-cases/process-transaction.usecase";
import { CancelTransactionUseCase } from "./application/use-cases/cancel-transaction.usecase";
import { ListTransactionsQuery } from "./application/queries/list-transactions.query";
import { GetTransactionDetailsQuery } from "./application/queries/get-transaction-details.query";
import { SearchTransactionsQuery } from "./application/queries/search-transactions.query";
import { GetBalanceQuery } from "./application/queries/get-balance.query";
import { GetSummaryQuery } from "./application/queries/get-summary.query";
import { PrismaTransactionRepository } from "./infrastructure/persistence/prisma-transaction.repository";
import { PrismaTransactionQueryService } from "./infrastructure/persistence/prisma-transaction.query.service";
import { TransactionRepository } from "./domain/repositories/transaction.repository";
import { TransactionQueryServiceInterface } from "./application/queries/transaction-query.service.interface";
import { ServiceOrderCreatedHandler } from "./application/event-handlers/service-order-created.handler";

/**
 * FinancialModule
 *
 * Módulo NestJS para o contexto Financial.
 * Configura todas as dependências e injeções.
 */
@Module({
  controllers: [TransactionController, TransactionQueryController],
  providers: [
    // Infrastructure
    PrismaService,
    {
      provide: "TransactionRepository",
      useClass: PrismaTransactionRepository,
    },
    {
      provide: "TransactionQueryServiceInterface",
      useClass: PrismaTransactionQueryService,
    },
    // Use Cases (Write Side)
    {
      provide: CreateTransactionUseCase,
      useFactory: (repository: TransactionRepository) => {
        return new CreateTransactionUseCase(repository);
      },
      inject: ["TransactionRepository"],
    },
    {
      provide: UpdateTransactionUseCase,
      useFactory: (repository: TransactionRepository) => {
        return new UpdateTransactionUseCase(repository);
      },
      inject: ["TransactionRepository"],
    },
    {
      provide: ApproveTransactionUseCase,
      useFactory: (repository: TransactionRepository) => {
        return new ApproveTransactionUseCase(repository);
      },
      inject: ["TransactionRepository"],
    },
    {
      provide: RejectTransactionUseCase,
      useFactory: (repository: TransactionRepository) => {
        return new RejectTransactionUseCase(repository);
      },
      inject: ["TransactionRepository"],
    },
    {
      provide: ProcessTransactionUseCase,
      useFactory: (repository: TransactionRepository) => {
        return new ProcessTransactionUseCase(repository);
      },
      inject: ["TransactionRepository"],
    },
    {
      provide: CancelTransactionUseCase,
      useFactory: (repository: TransactionRepository) => {
        return new CancelTransactionUseCase(repository);
      },
      inject: ["TransactionRepository"],
    },
    // Queries (Read Side)
    {
      provide: ListTransactionsQuery,
      useFactory: (queryService: TransactionQueryServiceInterface) => {
        return new ListTransactionsQuery(queryService);
      },
      inject: ["TransactionQueryServiceInterface"],
    },
    {
      provide: GetTransactionDetailsQuery,
      useFactory: (queryService: TransactionQueryServiceInterface) => {
        return new GetTransactionDetailsQuery(queryService);
      },
      inject: ["TransactionQueryServiceInterface"],
    },
    {
      provide: SearchTransactionsQuery,
      useFactory: (queryService: TransactionQueryServiceInterface) => {
        return new SearchTransactionsQuery(queryService);
      },
      inject: ["TransactionQueryServiceInterface"],
    },
    {
      provide: GetBalanceQuery,
      useFactory: (queryService: TransactionQueryServiceInterface) => {
        return new GetBalanceQuery(queryService);
      },
      inject: ["TransactionQueryServiceInterface"],
    },
    {
      provide: GetSummaryQuery,
      useFactory: (queryService: TransactionQueryServiceInterface) => {
        return new GetSummaryQuery(queryService);
      },
      inject: ["TransactionQueryServiceInterface"],
    },
    // Event Handlers
    {
      provide: "ServiceOrderCreatedHandler",
      useFactory: (repository: TransactionRepository) => {
        return new ServiceOrderCreatedHandler(repository);
      },
      inject: ["TransactionRepository"],
    },
  ],
  exports: [
    "ServiceOrderCreatedHandler",
    // Exportar para uso em outros módulos se necessário
    "TransactionRepository",
    "TransactionQueryServiceInterface",
  ],
})
export class FinancialModule {}

