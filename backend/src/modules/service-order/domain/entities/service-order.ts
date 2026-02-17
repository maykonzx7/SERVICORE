import { AggregateRoot } from "@shared/domain/aggregate-root";
import { ServiceOrderId } from "../value-objects/service-order-id";
import { CompanyId } from "../value-objects/company-id";
import { Priority } from "../value-objects/priority";
import { Money } from "../value-objects/money";
import { Status } from "../value-objects/status";
import { ServiceOrderCreatedEvent } from "../events/service-order-created.event";
import { ServiceOrderStartedEvent } from "../events/service-order-started.event";
import { ServiceOrderCompletedEvent } from "../events/service-order-completed.event";

/**
 * ServiceOrder Aggregate Root
 *
 * Representa uma ordem de serviço no sistema.
 * É o Aggregate Root do módulo Service Order.
 */
export class ServiceOrder extends AggregateRoot {
  private constructor(
    id: ServiceOrderId,
    private _companyId: CompanyId,
    private _description: string,
    private _priority: Priority,
    private _value: Money,
    private _status: Status
  ) {
    super(id.toString());
  }

  /**
   * Factory method para criar uma nova ordem de serviço
   * @param companyId ID da empresa
   * @param description Descrição do serviço
   * @param priority Prioridade
   * @param value Valor monetário
   * @returns Nova instância de ServiceOrder
   */
  static create(
    companyId: CompanyId,
    description: string,
    priority: Priority,
    value: Money
  ): ServiceOrder {
    // Validações
    if (!description || description.trim().length === 0) {
      throw new Error("Service order description cannot be empty");
    }

    const id = ServiceOrderId.generate();
    const status = Status.created();

    const order = new ServiceOrder(
      id,
      companyId,
      description,
      priority,
      value,
      status
    );

    // Publicar evento de domínio
    order.addDomainEvent(
      new ServiceOrderCreatedEvent(
        id.toString(),
        companyId.toString(),
        priority.toString(),
        value.getAmount()
      )
    );

    return order;
  }

  /**
   * Factory method para reconstruir a partir de dados persistidos
   * Use este método apenas em repositories/mappers
   */
  static reconstitute(
    id: string,
    companyId: string,
    description: string,
    priority: string,
    value: number,
    status: string,
    _createdAt: Date,
    _updatedAt: Date
  ): ServiceOrder {
    const order = new ServiceOrder(
      ServiceOrderId.create(id),
      CompanyId.create(companyId),
      description,
      Priority.create(priority),
      Money.create(value),
      Status.create(status)
    );

    return order;
  }

  /**
   * Getters
   */
  getId(): ServiceOrderId {
    return ServiceOrderId.create(super.id);
  }

  get companyId(): CompanyId {
    return this._companyId;
  }

  get description(): string {
    return this._description;
  }

  get priority(): Priority {
    return this._priority;
  }

  get value(): Money {
    return this._value;
  }

  get status(): Status {
    return this._status;
  }

  /**
   * Métodos de Negócio
   */

  /**
   * Inicia a ordem de serviço
   * @throws Error se o status não permitir a transição
   */
  start(): void {
    if (!this._status.canTransitionToStarted()) {
      throw new Error("Service order can only be started if status is CREATED");
    }

    this._status = Status.started();
    this.markAsUpdated();

    this.addDomainEvent(new ServiceOrderStartedEvent(this.getId().toString()));
  }

  /**
   * Coloca a ordem em progresso
   * @throws Error se o status não permitir a transição
   */
  markAsInProgress(): void {
    if (!this._status.canTransitionToInProgress()) {
      throw new Error(
        "Service order can only be marked as in progress if status is STARTED or PAUSED"
      );
    }

    this._status = Status.inProgress();
    this.markAsUpdated();
  }

  /**
   * Finaliza a ordem de serviço
   * @throws Error se o status não permitir a transição
   */
  complete(): void {
    if (!this._status.canTransitionToCompleted()) {
      throw new Error(
        "Service order can only be completed if status is IN_PROGRESS or STARTED"
      );
    }

    this._status = Status.completed();
    this.markAsUpdated();

    this.addDomainEvent(
      new ServiceOrderCompletedEvent(this.getId().toString())
    );
  }

  /**
   * Cancela a ordem de serviço
   * @throws Error se o status não permitir cancelamento
   */
  cancel(): void {
    if (!this._status.canBeCancelled()) {
      throw new Error(
        "Service order can only be cancelled if status is CREATED or STARTED"
      );
    }

    this._status = Status.cancelled();
    this.markAsUpdated();
  }

  /**
   * Atualiza a descrição da ordem
   * @param newDescription Nova descrição
   * @throws Error se a descrição for inválida ou ordem estiver finalizada
   */
  updateDescription(newDescription: string): void {
    if (this._status.isFinalized()) {
      throw new Error("Cannot update description of a finalized service order");
    }

    if (!newDescription || newDescription.trim().length === 0) {
      throw new Error("Description cannot be empty");
    }

    this._description = newDescription;
    this.markAsUpdated();
  }

  /**
   * Atualiza a prioridade da ordem
   * @param newPriority Nova prioridade
   * @throws Error se a ordem estiver finalizada
   */
  updatePriority(newPriority: Priority): void {
    if (this._status.isFinalized()) {
      throw new Error("Cannot update priority of a finalized service order");
    }

    this._priority = newPriority;
    this.markAsUpdated();
  }

  /**
   * Atualiza o valor da ordem
   * @param newValue Novo valor
   * @throws Error se a ordem estiver finalizada
   */
  updateValue(newValue: Money): void {
    if (this._status.isFinalized()) {
      throw new Error("Cannot update value of a finalized service order");
    }

    this._value = newValue;
    this.markAsUpdated();
  }
}
