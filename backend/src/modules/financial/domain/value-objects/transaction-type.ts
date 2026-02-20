import { ValueObject } from "@shared/domain/value-object";

/**
 * TransactionType Value Object
 *
 * Representa o tipo de transação (Receita ou Despesa)
 */
export class TransactionType extends ValueObject {
  private constructor(private readonly value: "INCOME" | "EXPENSE") {
    super();
    this.validate();
  }

  /**
   * Cria um TransactionType INCOME (Receita)
   */
  static income(): TransactionType {
    return new TransactionType("INCOME");
  }

  /**
   * Cria um TransactionType EXPENSE (Despesa)
   */
  static expense(): TransactionType {
    return new TransactionType("EXPENSE");
  }

  /**
   * Cria um TransactionType a partir de uma string
   * @param value Valor do tipo
   * @returns Instância de TransactionType
   * @throws Error se o valor for inválido
   */
  static create(value: string): TransactionType {
    if (value !== "INCOME" && value !== "EXPENSE") {
      throw new Error(`Invalid transaction type: ${value}`);
    }
    return new TransactionType(value);
  }

  /**
   * Valida o valor do tipo
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    if (this.value !== "INCOME" && this.value !== "EXPENSE") {
      throw new Error("TransactionType must be INCOME or EXPENSE");
    }
  }

  /**
   * Retorna o valor do tipo como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Verifica se é receita
   */
  isIncome(): boolean {
    return this.value === "INCOME";
  }

  /**
   * Verifica se é despesa
   */
  isExpense(): boolean {
    return this.value === "EXPENSE";
  }

  /**
   * Compara dois tipos
   * @param other Outro TransactionType
   * @returns true se os tipos forem iguais
   */
  equals(other: TransactionType): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}

