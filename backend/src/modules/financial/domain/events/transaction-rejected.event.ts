import { DomainEvent } from "@shared/domain/domain-event";

/**
 * TransactionRejectedEvent
 *
 * Evento disparado quando uma transação é rejeitada
 */
export class TransactionRejectedEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly rejectedBy: string,
    public readonly reason: string,
    public readonly amount: number
  ) {
    super();
  }

  get eventName(): string {
    return "TransactionRejected";
  }
}

