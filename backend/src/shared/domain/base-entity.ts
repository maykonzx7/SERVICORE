/**
 * Base Entity
 *
 * Classe base abstrata para todas as entidades do domínio.
 * Fornece funcionalidades comuns como ID, timestamps e comparação.
 */
export abstract class BaseEntity {
  protected _id: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  /**
   * Retorna o ID único da entidade
   */
  get id(): string {
    return this._id;
  }

  /**
   * Retorna a data de criação da entidade
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Retorna a data da última atualização da entidade
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Marca a entidade como atualizada, modificando o timestamp
   * Método protegido para ser usado apenas internamente
   */
  protected markAsUpdated(): void {
    this._updatedAt = new Date();
  }

  /**
   * Compara duas entidades pelo ID
   * @param entity Entidade a ser comparada
   * @returns true se as entidades têm o mesmo ID
   */
  equals(entity: BaseEntity): boolean {
    if (!entity) {
      return false;
    }
    return this._id === entity._id;
  }
}
