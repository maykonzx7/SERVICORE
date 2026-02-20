import { ValueObject } from "@shared/domain/value-object";

/**
 * TransactionId Value Object
 *
 * Identificador único de uma transação financeira
 */
export class TransactionId extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  /**
   * Cria um TransactionId a partir de uma string
   * @param value Valor do ID
   * @returns Instância de TransactionId
   * @throws Error se o valor for inválido
   */
  static create(value: string): TransactionId {
    return new TransactionId(value);
  }

  /**
   * Gera um novo TransactionId usando UUID
   * @returns Nova instância de TransactionId
   */
  static generate(): TransactionId {
    return new TransactionId(crypto.randomUUID());
  }

  /**
   * Valida o valor do ID
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("TransactionId cannot be empty");
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
   * @param other Outro TransactionId
   * @returns true se os IDs forem iguais
   */
  equals(other: TransactionId): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}

