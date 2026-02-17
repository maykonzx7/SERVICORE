import { DomainEvent } from "@shared/domain/domain-event";

/**
 * ServiceOrderCreatedEvent
 *
 * Evento disparado quando uma ordem de serviço é criada
 */
export class ServiceOrderCreatedEvent extends DomainEvent {
  constructor(
    public readonly serviceOrderId: string,
    public readonly companyId: string,
    public readonly priority: string,
    public readonly value: number
  ) {
    super();
  }

  get eventName(): string {
    return "ServiceOrderCreated";
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      serviceOrderId: this.serviceOrderId,
      companyId: this.companyId,
      priority: this.priority,
      value: this.value,
    };
  }
}
