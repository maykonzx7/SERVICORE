import { DomainEvent } from "@shared/domain/domain-event";

/**
 * CompanyCreatedEvent
 *
 * Evento de domínio disparado quando uma empresa é criada
 */
export class CompanyCreatedEvent extends DomainEvent {
  constructor(
    public readonly companyId: string,
    public readonly companyName: string,
    public readonly ownerId: string
  ) {
    super();
  }

  get eventName(): string {
    return "CompanyCreated";
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      companyId: this.companyId,
      companyName: this.companyName,
      ownerId: this.ownerId,
    };
  }
}

