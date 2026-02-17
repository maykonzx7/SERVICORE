import { ValueObject } from "@shared/domain/value-object";

/**
 * Priority Value Object
 *
 * Representa a prioridade de uma ordem de serviço
 */
export enum PriorityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export class Priority extends ValueObject {
  private constructor(private readonly value: PriorityLevel) {
    super();
    this.validate();
  }

  /**
   * Cria uma Priority a partir de uma string
   * @param value Nível de prioridade
   * @returns Instância de Priority
   * @throws Error se o valor for inválido
   */
  static create(value: string): Priority {
    const priorityLevel = value.toUpperCase() as PriorityLevel;
    return new Priority(priorityLevel);
  }

  /**
   * Cria uma Priority LOW
   */
  static low(): Priority {
    return new Priority(PriorityLevel.LOW);
  }

  /**
   * Cria uma Priority MEDIUM
   */
  static medium(): Priority {
    return new Priority(PriorityLevel.MEDIUM);
  }

  /**
   * Cria uma Priority HIGH
   */
  static high(): Priority {
    return new Priority(PriorityLevel.HIGH);
  }

  /**
   * Cria uma Priority CRITICAL
   */
  static critical(): Priority {
    return new Priority(PriorityLevel.CRITICAL);
  }

  /**
   * Valida o valor da prioridade
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    if (!Object.values(PriorityLevel).includes(this.value)) {
      throw new Error(
        `Invalid priority level. Must be one of: ${Object.values(PriorityLevel).join(", ")}`
      );
    }
  }

  /**
   * Retorna o valor da prioridade como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Retorna o valor da prioridade
   */
  getValue(): PriorityLevel {
    return this.value;
  }

  /**
   * Verifica se a prioridade é crítica
   */
  isCritical(): boolean {
    return this.value === PriorityLevel.CRITICAL;
  }

  /**
   * Verifica se a prioridade é alta ou crítica
   */
  isHighOrCritical(): boolean {
    return (
      this.value === PriorityLevel.HIGH || this.value === PriorityLevel.CRITICAL
    );
  }

  /**
   * Compara duas prioridades
   * @param other Outra Priority
   * @returns true se as prioridades forem iguais
   */
  equals(other: Priority): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}
