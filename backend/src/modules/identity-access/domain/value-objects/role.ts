import { ValueObject } from "@shared/domain/value-object";

/**
 * Role Value Object
 *
 * Representa um papel/perfil do usuário no sistema
 */
export class Role extends ValueObject {
  private static readonly VALID_ROLES = [
    "ADMIN",
    "COMPANY_ADMIN",
    "MANAGER",
    "TECHNICIAN",
    "CLIENT",
    "USER",
  ] as const;

  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  /**
   * Cria um Role a partir de uma string
   * @param value Nome do role
   * @returns Instância de Role
   * @throws Error se o role for inválido
   */
  static create(value: string): Role {
    return new Role(value.toUpperCase());
  }

  /**
   * Valida se o role é válido
   * @throws Error se o role for inválido
   */
  private validate(): void {
    if (!Role.VALID_ROLES.includes(this.value as any)) {
      throw new Error(
        `Invalid role: ${this.value}. Valid roles are: ${Role.VALID_ROLES.join(", ")}`
      );
    }
  }

  /**
   * Retorna o valor do role como string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Retorna todos os roles válidos
   */
  static getValidRoles(): readonly string[] {
    return Role.VALID_ROLES;
  }

  /**
   * Compara dois roles
   * @param other Outro Role
   * @returns true se os roles forem iguais
   */
  equals(other: Role): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}

