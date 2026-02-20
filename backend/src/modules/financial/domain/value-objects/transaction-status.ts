import { ValueObject } from "@shared/domain/value-object";

/**
 * TransactionStatus Value Object
 *
 * Representa o status de uma transação financeira
 */
export class TransactionStatus extends ValueObject {
  private constructor(
    private readonly value:
      | "PENDING"
      | "APPROVED"
      | "REJECTED"
      | "PROCESSED"
      | "CANCELLED"
  ) {
    super();
    this.validate();
  }

  /**
   * Cria um status PENDING (Pendente)
   */
  static pending(): TransactionStatus {
    return new TransactionStatus("PENDING");
  }

  /**
   * Cria um status APPROVED (Aprovada)
   */
  static approved(): TransactionStatus {
    return new TransactionStatus("APPROVED");
  }

  /**
   * Cria um status REJECTED (Rejeitada)
   */
  static rejected(): TransactionStatus {
    return new TransactionStatus("REJECTED");
  }

  /**
   * Cria um status PROCESSED (Processada)
   */
  static processed(): TransactionStatus {
    return new TransactionStatus("PROCESSED");
  }

  /**
   * Cria um status CANCELLED (Cancelada)
   */
  static cancelled(): TransactionStatus {
    return new TransactionStatus("CANCELLED");
  }

  /**
   * Cria um TransactionStatus a partir de uma string
   * @param value Valor do status
   * @returns Instância de TransactionStatus
   * @throws Error se o valor for inválido
   */
  static create(value: string): TransactionStatus {
    const validStatuses = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "PROCESSED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid transaction status: ${value}`);
    }
    return new TransactionStatus(
      value as
        | "PENDING"
        | "APPROVED"
        | "REJECTED"
        | "PROCESSED"
        | "CANCELLED"
    );
  }

  /**
   * Valida o valor do status
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    const validStatuses = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "PROCESSED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(this.value)) {
      throw new Error("Invalid transaction status");
    }
  }

  /**
   * Retorna o valor do status como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Verifica se está pendente
   */
  isPending(): boolean {
    return this.value === "PENDING";
  }

  /**
   * Verifica se está aprovada
   */
  isApproved(): boolean {
    return this.value === "APPROVED";
  }

  /**
   * Verifica se está rejeitada
   */
  isRejected(): boolean {
    return this.value === "REJECTED";
  }

  /**
   * Verifica se está processada
   */
  isProcessed(): boolean {
    return this.value === "PROCESSED";
  }

  /**
   * Verifica se está cancelada
   */
  isCancelled(): boolean {
    return this.value === "CANCELLED";
  }

  /**
   * Verifica se pode ser editada
   */
  canBeEdited(): boolean {
    return this.value === "PENDING" || this.value === "APPROVED";
  }

  /**
   * Verifica se pode ser processada
   */
  canBeProcessed(): boolean {
    return this.value === "APPROVED";
  }

  /**
   * Verifica se pode ser aprovada
   */
  canBeApproved(): boolean {
    return this.value === "PENDING";
  }

  /**
   * Verifica se pode ser rejeitada
   */
  canBeRejected(): boolean {
    return this.value === "PENDING" || this.value === "APPROVED";
  }

  /**
   * Verifica se pode ser cancelada
   */
  canBeCancelled(): boolean {
    return this.value === "PENDING" || this.value === "APPROVED";
  }

  /**
   * Compara dois status
   * @param other Outro TransactionStatus
   * @returns true se os status forem iguais
   */
  equals(other: TransactionStatus): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}

