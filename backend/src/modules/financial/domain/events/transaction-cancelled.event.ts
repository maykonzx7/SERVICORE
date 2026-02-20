import { DomainEvent } from "@shared/domain/domain-event";

/**
 * TransactionCancelledEvent
 *
 * Evento disparado quando uma transação é cancelada
 */
export class TransactionCancelledEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly companyId: string,
    public readonly amount: number
  ) {
    super();
  }

  get eventName(): string {
    return "TransactionCancelled";
  }
}

