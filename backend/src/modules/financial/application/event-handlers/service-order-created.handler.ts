import { Injectable } from "@nestjs/common";
import { ServiceOrderCreatedEvent } from "@modules/service-order/domain/events/service-order-created.event";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { Transaction } from "../../domain/entities/transaction";
import { CompanyId } from "@modules/service-order/domain/value-objects/company-id";
import { ServiceOrderId } from "@modules/service-order/domain/value-objects/service-order-id";
import { TransactionType } from "../../domain/value-objects/transaction-type";
import { Money } from "@modules/service-order/domain/value-objects/money";

/**
 * ServiceOrderCreatedHandler
 *
 * Handler que processa o evento ServiceOrderCreatedEvent
 * e cria automaticamente uma transação de receita associada à ordem de serviço.
 */
@Injectable()
export class ServiceOrderCreatedHandler {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  /**
   * Processa o evento de criação de ordem de serviço
   * Cria uma transação de receita (INCOME) associada à ordem
   */
  async handle(event: ServiceOrderCreatedEvent): Promise<void> {
    try {
      // Criar Value Objects
      const companyId = CompanyId.create(event.companyId);
      const serviceOrderId = ServiceOrderId.create(event.serviceOrderId);
      const type = TransactionType.income(); // Sempre receita quando criada a partir de ordem
      const amount = Money.create(event.value, "BRL");

      // Criar transação associada à ordem de serviço
      const transaction = Transaction.create(
        companyId,
        type,
        amount,
        `Receita referente à ordem de serviço #${event.serviceOrderId.slice(0, 8)}`,
        "BRL",
        serviceOrderId,
        null, // paymentMethod - será definido quando processar
        null // dueDate - será definido quando processar
      );

      // Persistir transação
      await this.transactionRepository.save(transaction);
    } catch (error) {
      // Log do erro mas não interrompe o fluxo de criação da ordem
      console.error(
        `Erro ao criar transação para ordem de serviço ${event.serviceOrderId}:`,
        error
      );
      // Não relançar o erro para não quebrar a criação da ordem
    }
  }
}

