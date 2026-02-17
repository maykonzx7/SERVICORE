import { AggregateRoot } from "@shared/domain/aggregate-root";
import { UserId } from "../value-objects/user-id";
import { Email } from "../value-objects/email";
import { Password } from "../value-objects/password";
import { Role } from "../value-objects/role";
import { UserCreatedEvent } from "../events/user-created.event";
import { UserAuthenticatedEvent } from "../events/user-authenticated.event";

/**
 * User Aggregate Root
 *
 * Representa um usuário do sistema com suas credenciais, roles e estado.
 * É o Aggregate Root do módulo Identity & Access.
 */
export class User extends AggregateRoot {
  private constructor(
    id: UserId,
    private _email: Email,
    private _password: Password,
    private _name: string | null,
    private _roles: Role[],
    private _active: boolean,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id.toString(), createdAt, updatedAt);
  }

  /**
   * Factory method para criar um novo usuário
   * @param email Email do usuário
   * @param password Senha em texto plano (será hasheada)
   * @param name Nome do usuário (opcional)
   * @param roles Roles do usuário (padrão: ["USER"])
   * @returns Nova instância de User
   */
  static async create(
    email: Email,
    password: Password,
    name: string | null = null,
    roles: Role[] = [Role.create("USER")]
  ): Promise<User> {
    // Validações
    if (roles.length === 0) {
      throw new Error("User must have at least one role");
    }

    const id = UserId.generate();

    const user = new User(id, email, password, name, roles, true);

    // Publicar evento de domínio
    user.addDomainEvent(
      new UserCreatedEvent(
        id.toString(),
        email.toString(),
        name,
        roles.map((r) => r.toString())
      )
    );

    return user;
  }

  /**
   * Factory method para reconstruir a partir de dados persistidos
   * Use este método apenas em repositories/mappers
   */
  static reconstitute(
    id: string,
    email: string,
    hashedPassword: string,
    name: string | null,
    roles: string[],
    active: boolean,
    createdAt: Date,
    updatedAt: Date
  ): User {
    const userId = UserId.create(id);
    const userEmail = Email.create(email);
    const password = Password.fromHash(hashedPassword);
    const userRoles = roles.map((r) => Role.create(r));

    return new User(
      userId,
      userEmail,
      password,
      name,
      userRoles,
      active,
      createdAt,
      updatedAt
    );
  }

  /**
   * Autentica o usuário verificando a senha
   * @param plainPassword Senha em texto plano
   * @returns true se a senha estiver correta
   */
  async authenticate(plainPassword: string): Promise<boolean> {
    if (!this._active) {
      throw new Error("User is not active");
    }

    const isValid = await this._password.compare(plainPassword);

    if (isValid) {
      this.addDomainEvent(
        new UserAuthenticatedEvent(this.id, this._email.toString())
      );
    }

    return isValid;
  }

  /**
   * Altera a senha do usuário
   * @param newPassword Nova senha em texto plano
   */
  async changePassword(newPassword: Password): Promise<void> {
    this._password = newPassword;
    this.markAsUpdated();
  }

  /**
   * Ativa o usuário
   */
  activate(): void {
    if (this._active) {
      return;
    }
    this._active = true;
    this.markAsUpdated();
  }

  /**
   * Desativa o usuário
   */
  deactivate(): void {
    if (!this._active) {
      return;
    }
    this._active = false;
    this.markAsUpdated();
  }

  /**
   * Adiciona um role ao usuário
   * @param role Role a ser adicionado
   */
  addRole(role: Role): void {
    const roleExists = this._roles.some((r) => r.equals(role));
    if (!roleExists) {
      this._roles.push(role);
      this.markAsUpdated();
    }
  }

  /**
   * Remove um role do usuário
   * @param role Role a ser removido
   */
  removeRole(role: Role): void {
    const initialLength = this._roles.length;
    this._roles = this._roles.filter((r) => !r.equals(role));

    if (this._roles.length === 0) {
      throw new Error("User must have at least one role");
    }

    if (this._roles.length < initialLength) {
      this.markAsUpdated();
    }
  }

  /**
   * Verifica se o usuário possui um role específico
   * @param role Role a ser verificado
   * @returns true se o usuário possui o role
   */
  hasRole(role: Role): boolean {
    return this._roles.some((r) => r.equals(role));
  }

  /**
   * Verifica se o usuário possui qualquer um dos roles fornecidos
   * @param roles Roles a serem verificados
   * @returns true se o usuário possui pelo menos um dos roles
   */
  hasAnyRole(roles: Role[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  // Getters
  get email(): Email {
    return this._email;
  }

  get name(): string | null {
    return this._name;
  }

  get roles(): Role[] {
    return [...this._roles];
  }

  get active(): boolean {
    return this._active;
  }

  /**
   * Retorna a senha hasheada (apenas para persistência)
   * NUNCA exponha isso em respostas da API
   */
  getHashedPassword(): string {
    return this._password.getHashedValue();
  }
}

