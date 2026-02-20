import { DomainEvent } from "@shared/domain/domain-event";

/**
 * TransactionCreatedEvent
 *
 * Evento disparado quando uma nova transação é criada
 */
export class TransactionCreatedEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly companyId: string,
    public readonly type: string,
    public readonly amount: number,
    public readonly currency: string
  ) {
    super();
  }

  get eventName(): string {
    return "TransactionCreated";
  }
}

