import { ValueObject } from "@shared/domain/value-object";

/**
 * Permission Value Object
 *
 * Representa uma permissão específica no sistema
 * Formato: {resource}:{action}
 * Exemplo: "service-order:create", "financial:view"
 */
export class Permission extends ValueObject {
  private constructor(
    private readonly resource: string,
    private readonly action: string
  ) {
    super();
    this.validate();
  }

  /**
   * Cria uma Permission a partir de uma string no formato "resource:action"
   * @param value String no formato "resource:action"
   * @returns Instância de Permission
   * @throws Error se o formato for inválido
   */
  static create(value: string): Permission {
    const parts = value.split(":");
    if (parts.length !== 2) {
      throw new Error(`Invalid permission format: ${value}. Expected format: resource:action`);
    }
    return new Permission(parts[0].trim(), parts[1].trim());
  }

  /**
   * Cria uma Permission a partir de resource e action separados
   * @param resource Recurso (ex: "service-order")
   * @param action Ação (ex: "create")
   * @returns Instância de Permission
   */
  static createFromParts(resource: string, action: string): Permission {
    return new Permission(resource.trim(), action.trim());
  }

  /**
   * Valida se a permissão é válida
   * @throws Error se a permissão for inválida
   */
  private validate(): void {
    if (!this.resource || this.resource.length === 0) {
      throw new Error("Permission resource cannot be empty");
    }
    if (!this.action || this.action.length === 0) {
      throw new Error("Permission action cannot be empty");
    }
  }

  /**
   * Retorna o resource da permissão
   */
  getResource(): string {
    return this.resource;
  }

  /**
   * Retorna a action da permissão
   */
  getAction(): string {
    return this.action;
  }

  /**
   * Retorna a permissão como string no formato "resource:action"
   */
  toString(): string {
    return `${this.resource}:${this.action}`;
  }

  /**
   * Compara duas permissões
   * @param other Outra Permission
   * @returns true se as permissões forem iguais
   */
  equals(other: Permission): boolean {
    if (!other) {
      return false;
    }
    return this.resource === other.resource && this.action === other.action;
  }
}

/**
 * Mapeamento de permissões por role
 */
export class RolePermissions {
  private static readonly PERMISSIONS_BY_ROLE: Record<string, string[]> = {
    ADMIN: [
      // Todos os recursos
      "user:create",
      "user:update",
      "user:delete",
      "user:view",
      "user:assign-roles",
      "role:create",
      "role:update",
      "role:delete",
      "role:view",
      "permission:view",
      "company:create",
      "company:update",
      "company:delete",
      "company:view",
      "service-order:create",
      "service-order:update",
      "service-order:delete",
      "service-order:view",
      "service-order:start",
      "service-order:complete",
      "service-order:cancel",
      "financial:create",
      "financial:update",
      "financial:delete",
      "financial:view",
      "financial:approve",
      "report:view",
      "report:export",
      "settings:view",
      "settings:update",
    ],
    COMPANY_ADMIN: [
      "user:view",
      "user:create",
      "user:update",
      "user:assign-roles",
      "role:view",
      "company:view",
      "company:update",
      "service-order:create",
      "service-order:update",
      "service-order:view",
      "service-order:start",
      "service-order:complete",
      "service-order:cancel",
      "financial:create",
      "financial:update",
      "financial:view",
      "financial:approve",
      "report:view",
      "report:export",
      "settings:view",
      "settings:update",
    ],
    MANAGER: [
      "user:view",
      "service-order:create",
      "service-order:update",
      "service-order:view",
      "service-order:start",
      "service-order:complete",
      "service-order:cancel",
      "financial:view",
      "report:view",
    ],
    TECHNICIAN: [
      "service-order:view",
      "service-order:update",
      "service-order:start",
      "service-order:complete",
    ],
    CLIENT: [
      "service-order:view",
      "service-order:create",
    ],
    USER: [
      "service-order:view",
    ],
  };

  /**
   * Retorna todas as permissões de um role
   * @param role Nome do role
   * @returns Array de permissões no formato "resource:action"
   */
  static getPermissionsByRole(role: string): string[] {
    return this.PERMISSIONS_BY_ROLE[role.toUpperCase()] || [];
  }

  /**
   * Retorna todos os roles e suas permissões
   * @returns Record com role como chave e array de permissões como valor
   */
  static getAllRolePermissions(): Record<string, string[]> {
    return { ...this.PERMISSIONS_BY_ROLE };
  }

  /**
   * Retorna todas as permissões disponíveis no sistema
   * @returns Array único de todas as permissões
   */
  static getAllPermissions(): string[] {
    const allPermissions = new Set<string>();
    Object.values(this.PERMISSIONS_BY_ROLE).forEach((permissions) => {
      permissions.forEach((perm) => allPermissions.add(perm));
    });
    return Array.from(allPermissions).sort();
  }

  /**
   * Retorna permissões agrupadas por resource
   * @returns Record com resource como chave e array de actions como valor
   */
  static getPermissionsByResource(): Record<string, string[]> {
    const grouped: Record<string, Set<string>> = {};
    
    this.getAllPermissions().forEach((permission) => {
      const [resource, action] = permission.split(":");
      if (!grouped[resource]) {
        grouped[resource] = new Set();
      }
      grouped[resource].add(action);
    });

    const result: Record<string, string[]> = {};
    Object.keys(grouped).forEach((resource) => {
      result[resource] = Array.from(grouped[resource]).sort();
    });

    return result;
  }
}

