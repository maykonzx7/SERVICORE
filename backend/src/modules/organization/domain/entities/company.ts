import { AggregateRoot } from "@shared/domain/aggregate-root";
import { CompanyId } from "../value-objects/company-id";
import { UserId } from "@modules/identity-access/domain/value-objects/user-id";
import { CompanyCreatedEvent } from "../events/company-created.event";

/**
 * Company Aggregate Root
 *
 * Representa uma empresa no sistema.
 * É o Aggregate Root do módulo Organization.
 */
export class Company extends AggregateRoot {
  private constructor(
    id: CompanyId,
    private _name: string,
    private _document: string | null,
    private _email: string | null,
    private _phone: string | null,
    private _address: string | null,
    private _city: string | null,
    private _state: string | null,
    private _zipCode: string | null,
    private _ownerId: UserId,
    private _active: boolean,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id.toString(), createdAt, updatedAt);
  }

  /**
   * Factory method para criar uma nova empresa
   * @param name Nome da empresa
   * @param ownerId ID do proprietário
   * @param document Documento (CPF/CNPJ) - opcional
   * @param email Email - opcional
   * @param phone Telefone - opcional
   * @param address Endereço - opcional
   * @param city Cidade - opcional
   * @param state Estado - opcional
   * @param zipCode CEP - opcional
   * @returns Nova instância de Company
   */
  static create(
    name: string,
    ownerId: UserId,
    document: string | null = null,
    email: string | null = null,
    phone: string | null = null,
    address: string | null = null,
    city: string | null = null,
    state: string | null = null,
    zipCode: string | null = null
  ): Company {
    // Validações
    if (!name || name.trim().length === 0) {
      throw new Error("Company name cannot be empty");
    }

    const id = CompanyId.generate();

    const company = new Company(
      id,
      name.trim(),
      document?.trim() || null,
      email?.trim() || null,
      phone?.trim() || null,
      address?.trim() || null,
      city?.trim() || null,
      state?.trim() || null,
      zipCode?.trim() || null,
      ownerId,
      true
    );

    // Publicar evento de domínio
    company.addDomainEvent(
      new CompanyCreatedEvent(
        id.toString(),
        name,
        ownerId.toString()
      )
    );

    return company;
  }

  /**
   * Factory method para reconstruir a partir de dados persistidos
   * Use este método apenas em repositories/mappers
   */
  static reconstitute(
    id: string,
    name: string,
    document: string | null,
    email: string | null,
    phone: string | null,
    address: string | null,
    city: string | null,
    state: string | null,
    zipCode: string | null,
    ownerId: string,
    active: boolean,
    createdAt: Date,
    updatedAt: Date
  ): Company {
    const companyId = CompanyId.create(id);
    const userId = UserId.create(ownerId);

    return new Company(
      companyId,
      name,
      document,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      userId,
      active,
      createdAt,
      updatedAt
    );
  }

  /**
   * Atualiza os dados da empresa
   */
  update(
    name?: string,
    document?: string | null,
    email?: string | null,
    phone?: string | null,
    address?: string | null,
    city?: string | null,
    state?: string | null,
    zipCode?: string | null
  ): void {
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        throw new Error("Company name cannot be empty");
      }
      this._name = name.trim();
    }

    if (document !== undefined) {
      this._document = document?.trim() || null;
    }

    if (email !== undefined) {
      this._email = email?.trim() || null;
    }

    if (phone !== undefined) {
      this._phone = phone?.trim() || null;
    }

    if (address !== undefined) {
      this._address = address?.trim() || null;
    }

    if (city !== undefined) {
      this._city = city?.trim() || null;
    }

    if (state !== undefined) {
      this._state = state?.trim() || null;
    }

    if (zipCode !== undefined) {
      this._zipCode = zipCode?.trim() || null;
    }
  }

  /**
   * Ativa a empresa
   */
  activate(): void {
    this._active = true;
  }

  /**
   * Desativa a empresa
   */
  deactivate(): void {
    this._active = false;
  }

  // Getters
  get id(): CompanyId {
    return this._id as unknown as CompanyId;
  }

  get name(): string {
    return this._name;
  }

  get document(): string | null {
    return this._document;
  }

  get email(): string | null {
    return this._email;
  }

  get phone(): string | null {
    return this._phone;
  }

  get address(): string | null {
    return this._address;
  }

  get city(): string | null {
    return this._city;
  }

  get state(): string | null {
    return this._state;
  }

  get zipCode(): string | null {
    return this._zipCode;
  }

  get ownerId(): UserId {
    return this._ownerId;
  }

  get active(): boolean {
    return this._active;
  }
}

