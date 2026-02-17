/**
 * Domain Event
 *
 * Classe base abstrata para todos os eventos de domínio.
 * Eventos de domínio representam algo significativo que aconteceu no domínio.
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor() {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
  }

  /**
   * Nome do evento, usado para identificação e roteamento
   * Deve ser implementado por cada evento específico
   */
  abstract get eventName(): string;
}
