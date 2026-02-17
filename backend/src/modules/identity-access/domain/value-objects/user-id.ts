import { ValueObject } from "@shared/domain/value-object";

/**
 * UserId Value Object
 *
 * Identificador único de um usuário
 */
export class UserId extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  /**
   * Cria um UserId a partir de uma string
   * @param value Valor do ID
   * @returns Instância de UserId
   * @throws Error se o valor for inválido
   */
  static create(value: string): UserId {
    return new UserId(value);
  }

  /**
   * Gera um novo UserId usando UUID
   * @returns Nova instância de UserId
   */
  static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  /**
   * Valida o valor do ID
   * @throws Error se o valor for inválido
   */
  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("UserId cannot be empty");
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
   * @param other Outro UserId
   * @returns true se os IDs forem iguais
   */
  equals(other: UserId): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}

