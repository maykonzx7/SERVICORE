import { DomainEvent } from "@shared/domain/domain-event";

/**
 * UserCreatedEvent
 *
 * Evento de domínio disparado quando um novo usuário é criado
 */
export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string | null,
    public readonly roles: string[]
  ) {
    super();
  }

  get eventName(): string {
    return "UserCreated";
  }
}

