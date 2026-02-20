import { DomainEvent } from "@shared/domain/domain-event";

/**
 * TransactionApprovedEvent
 *
 * Evento disparado quando uma transação é aprovada
 */
export class TransactionApprovedEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly approvedBy: string,
    public readonly amount: number
  ) {
    super();
  }

  get eventName(): string {
    return "TransactionApproved";
  }
}

