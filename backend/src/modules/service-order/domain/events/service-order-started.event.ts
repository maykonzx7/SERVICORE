import { DomainEvent } from "@shared/domain/domain-event";

/**
 * ServiceOrderStartedEvent
 *
 * Evento disparado quando uma ordem de serviço é iniciada
 */
export class ServiceOrderStartedEvent extends DomainEvent {
  constructor(public readonly serviceOrderId: string) {
    super();
  }

  get eventName(): string {
    return "ServiceOrderStarted";
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      serviceOrderId: this.serviceOrderId,
    };
  }
}
