import { BaseEntity } from "./base-entity";
import { DomainEvent } from "./domain-event";

/**
 * Aggregate Root
 *
 * Classe base para todas as raízes de agregado.
 * Um Aggregate Root é a única entrada para acessar um agregado,
 * garantindo consistência e invariantes.
 *
 * Gerencia eventos de domínio que são publicados quando algo
 * significativo acontece no agregado.
 */
export abstract class AggregateRoot extends BaseEntity {
  private _domainEvents: DomainEvent[] = [];

  /**
   * Adiciona um evento de domínio ao agregado
   * @param event Evento de domínio a ser adicionado
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Retorna uma cópia dos eventos de domínio
   * @returns Array de eventos de domínio
   */
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Limpa todos os eventos de domínio do agregado
   * Deve ser chamado após os eventos serem publicados
   */
  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Verifica se o agregado possui eventos de domínio pendentes
   * @returns true se houver eventos pendentes
   */
  hasDomainEvents(): boolean {
    return this._domainEvents.length > 0;
  }
}
