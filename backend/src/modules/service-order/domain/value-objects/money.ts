import { ValueObject } from "@shared/domain/value-object";

/**
 * Money Value Object
 *
 * Representa um valor monetário com moeda
 */
export class Money extends ValueObject {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = "BRL"
  ) {
    super();
    this.validate();
  }

  /**
   * Cria um Money a partir de um valor numérico
   * @param amount Valor monetário
   * @param currency Moeda (padrão: BRL)
   * @returns Instância de Money
   * @throws Error se o valor for inválido
   */
  static create(amount: number, currency: string = "BRL"): Money {
    return new Money(amount, currency);
  }

  /**
   * Cria um Money com valor zero
   * @param currency Moeda (padrão: BRL)
   * @returns Instância de Money com valor zero
   */
  static zero(currency: string = "BRL"): Money {
    return new Money(0, currency);
  }

  /**
   * Valida o valor monetário
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    if (isNaN(this.amount) || !isFinite(this.amount)) {
      throw new Error("Money amount must be a valid number");
    }

    if (this.amount < 0) {
      throw new Error("Money amount cannot be negative");
    }

    if (!this.currency || this.currency.trim().length === 0) {
      throw new Error("Currency cannot be empty");
    }
  }

  /**
   * Retorna o valor monetário
   */
  getAmount(): number {
    return Math.round(this.amount * 100) / 100; // Arredonda para 2 casas decimais
  }

  /**
   * Retorna a moeda
   */
  getCurrency(): string {
    return this.currency;
  }

  /**
   * Soma dois valores monetários (mesma moeda)
   * @param other Outro Money
   * @returns Novo Money com a soma
   * @throws Error se as moedas forem diferentes
   */
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add money with different currencies");
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  /**
   * Subtrai dois valores monetários (mesma moeda)
   * @param other Outro Money
   * @returns Novo Money com a subtração
   * @throws Error se as moedas forem diferentes ou resultado negativo
   */
  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot subtract money with different currencies");
    }
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error("Money result cannot be negative");
    }
    return new Money(result, this.currency);
  }

  /**
   * Multiplica o valor por um número
   * @param multiplier Multiplicador
   * @returns Novo Money com o valor multiplicado
   */
  multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new Error("Multiplier cannot be negative");
    }
    return new Money(this.amount * multiplier, this.currency);
  }

  /**
   * Compara dois valores monetários
   * @param other Outro Money
   * @returns true se os valores e moedas forem iguais
   */
  equals(other: Money): boolean {
    if (!other) {
      return false;
    }
    return (
      this.getAmount() === other.getAmount() && this.currency === other.currency
    );
  }

  /**
   * Verifica se o valor é maior que outro
   * @param other Outro Money
   * @returns true se este valor for maior
   */
  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error("Cannot compare money with different currencies");
    }
    return this.amount > other.amount;
  }

  /**
   * Verifica se o valor é zero
   */
  isZero(): boolean {
    return this.amount === 0;
  }
}
