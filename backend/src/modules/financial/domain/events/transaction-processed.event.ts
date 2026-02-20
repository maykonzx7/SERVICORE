import { DomainEvent } from "@shared/domain/domain-event";

/**
 * TransactionProcessedEvent
 *
 * Evento disparado quando uma transação é processada (efetivada)
 */
export class TransactionProcessedEvent extends DomainEvent {
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
    return "TransactionProcessed";
  }
}

