import { ValueObject } from "@shared/domain/value-object";

/**
 * Email Value Object
 *
 * Representa um endereço de email válido
 */
export class Email extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  /**
   * Cria um Email a partir de uma string
   * @param value Endereço de email
   * @returns Instância de Email
   * @throws Error se o email for inválido
   */
  static create(value: string): Email {
    return new Email(value.trim().toLowerCase());
  }

  /**
   * Valida o formato do email
   * @throws Error se o email for inválido
   */
  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("Email cannot be empty");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new Error("Invalid email format");
    }
  }

  /**
   * Retorna o valor do email como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Compara dois emails
   * @param other Outro Email
   * @returns true se os emails forem iguais
   */
  equals(other: Email): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}

