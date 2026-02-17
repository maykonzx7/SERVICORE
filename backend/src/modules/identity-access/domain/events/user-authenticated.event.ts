import { DomainEvent } from "@shared/domain/domain-event";

/**
 * UserAuthenticatedEvent
 *
 * Evento de domínio disparado quando um usuário faz login
 */
export class UserAuthenticatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string
  ) {
    super();
  }

  get eventName(): string {
    return "UserAuthenticated";
  }
}

