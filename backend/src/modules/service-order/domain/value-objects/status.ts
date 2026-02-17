import { ValueObject } from "@shared/domain/value-object";

/**
 * Status Value Object
 *
 * Representa o status de uma ordem de serviço
 */
export enum ServiceOrderStatus {
  CREATED = "CREATED",
  STARTED = "STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

export class Status extends ValueObject {
  private constructor(private readonly value: ServiceOrderStatus) {
    super();
    this.validate();
  }

  /**
   * Cria um Status a partir de uma string
   * @param value Status da ordem
   * @returns Instância de Status
   * @throws Error se o valor for inválido
   */
  static create(value: string): Status {
    const statusValue = value.toUpperCase() as ServiceOrderStatus;
    return new Status(statusValue);
  }

  /**
   * Cria um Status CREATED
   */
  static created(): Status {
    return new Status(ServiceOrderStatus.CREATED);
  }

  /**
   * Cria um Status STARTED
   */
  static started(): Status {
    return new Status(ServiceOrderStatus.STARTED);
  }

  /**
   * Cria um Status IN_PROGRESS
   */
  static inProgress(): Status {
    return new Status(ServiceOrderStatus.IN_PROGRESS);
  }

  /**
   * Cria um Status COMPLETED
   */
  static completed(): Status {
    return new Status(ServiceOrderStatus.COMPLETED);
  }

  /**
   * Cria um Status CANCELLED
   */
  static cancelled(): Status {
    return new Status(ServiceOrderStatus.CANCELLED);
  }

  /**
   * Valida o valor do status
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    if (!Object.values(ServiceOrderStatus).includes(this.value)) {
      throw new Error(
        `Invalid status. Must be one of: ${Object.values(ServiceOrderStatus).join(", ")}`
      );
    }
  }

  /**
   * Retorna o valor do status como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Retorna o valor do status
   */
  getValue(): ServiceOrderStatus {
    return this.value;
  }

  /**
   * Verifica se pode transicionar para STARTED
   */
  canTransitionToStarted(): boolean {
    return this.value === ServiceOrderStatus.CREATED;
  }

  /**
   * Verifica se pode transicionar para IN_PROGRESS
   */
  canTransitionToInProgress(): boolean {
    return (
      this.value === ServiceOrderStatus.STARTED ||
      this.value === ServiceOrderStatus.PAUSED
    );
  }

  /**
   * Verifica se pode transicionar para COMPLETED
   */
  canTransitionToCompleted(): boolean {
    return (
      this.value === ServiceOrderStatus.IN_PROGRESS ||
      this.value === ServiceOrderStatus.STARTED
    );
  }

  /**
   * Verifica se pode ser cancelado
   */
  canBeCancelled(): boolean {
    return (
      this.value === ServiceOrderStatus.CREATED ||
      this.value === ServiceOrderStatus.STARTED
    );
  }

  /**
   * Verifica se está finalizado (COMPLETED, CANCELLED, REJECTED)
   */
  isFinalized(): boolean {
    return (
      this.value === ServiceOrderStatus.COMPLETED ||
      this.value === ServiceOrderStatus.CANCELLED ||
      this.value === ServiceOrderStatus.REJECTED
    );
  }

  /**
   * Compara dois status
   * @param other Outro Status
   * @returns true se os status forem iguais
   */
  equals(other: Status): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}
