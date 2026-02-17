import { DomainEvent } from "@shared/domain/domain-event";

/**
 * ServiceOrderCompletedEvent
 *
 * Evento disparado quando uma ordem de serviço é finalizada
 */
export class ServiceOrderCompletedEvent extends DomainEvent {
  constructor(public readonly serviceOrderId: string) {
    super();
  }

  get eventName(): string {
    return "ServiceOrderCompleted";
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
