import { ValueObject } from "@shared/domain/value-object";

/**
 * ServiceOrderId Value Object
 *
 * Identificador único de uma ordem de serviço
 */
export class ServiceOrderId extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  /**
   * Cria um ServiceOrderId a partir de uma string
   * @param value Valor do ID
   * @returns Instância de ServiceOrderId
   * @throws Error se o valor for inválido
   */
  static create(value: string): ServiceOrderId {
    return new ServiceOrderId(value);
  }

  /**
   * Gera um novo ServiceOrderId usando UUID
   * @returns Nova instância de ServiceOrderId
   */
  static generate(): ServiceOrderId {
    return new ServiceOrderId(crypto.randomUUID());
  }

  /**
   * Valida o valor do ID
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("ServiceOrderId cannot be empty");
    }
  }

  /**
   * Retorna o valor do ID como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Compara dois IDs
   * @param other Outro ServiceOrderId
   * @returns true se os IDs forem iguais
   */
  equals(other: ServiceOrderId): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}
