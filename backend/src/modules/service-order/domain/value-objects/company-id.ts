import { ValueObject } from "@shared/domain/value-object";

/**
 * CompanyId Value Object
 *
 * Identificador de uma empresa (referência ao módulo Organization)
 */
export class CompanyId extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  /**
   * Cria um CompanyId a partir de uma string
   * @param value Valor do ID
   * @returns Instância de CompanyId
   * @throws Error se o valor for inválido
   */
  static create(value: string): CompanyId {
    return new CompanyId(value);
  }

  /**
   * Valida o valor do ID
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("CompanyId cannot be empty");
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
   * @param other Outro CompanyId
   * @returns true se os IDs forem iguais
   */
  equals(other: CompanyId): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}
