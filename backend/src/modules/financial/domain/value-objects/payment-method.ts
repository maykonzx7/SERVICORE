import { ValueObject } from "@shared/domain/value-object";

/**
 * PaymentMethod Value Object
 *
 * Representa o método de pagamento de uma transação
 */
export class PaymentMethod extends ValueObject {
  private constructor(
    private readonly value:
      | "CASH"
      | "PIX"
      | "CREDIT_CARD"
      | "DEBIT_CARD"
      | "BANK_TRANSFER"
      | "CHECK"
      | "OTHER"
  ) {
    super();
    this.validate();
  }

  /**
   * Cria um PaymentMethod a partir de uma string
   * @param value Valor do método
   * @returns Instância de PaymentMethod
   * @throws Error se o valor for inválido
   */
  static create(value: string): PaymentMethod {
    const validMethods = [
      "CASH",
      "PIX",
      "CREDIT_CARD",
      "DEBIT_CARD",
      "BANK_TRANSFER",
      "CHECK",
      "OTHER",
    ];
    if (!validMethods.includes(value)) {
      throw new Error(`Invalid payment method: ${value}`);
    }
    return new PaymentMethod(
      value as
        | "CASH"
        | "PIX"
        | "CREDIT_CARD"
        | "DEBIT_CARD"
        | "BANK_TRANSFER"
        | "CHECK"
        | "OTHER"
    );
  }

  /**
   * Valida o valor do método
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    const validMethods = [
      "CASH",
      "PIX",
      "CREDIT_CARD",
      "DEBIT_CARD",
      "BANK_TRANSFER",
      "CHECK",
      "OTHER",
    ];
    if (!validMethods.includes(this.value)) {
      throw new Error("Invalid payment method");
    }
  }

  /**
   * Retorna o valor do método como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Compara dois métodos
   * @param other Outro PaymentMethod
   * @returns true se os métodos forem iguais
   */
  equals(other: PaymentMethod): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}

