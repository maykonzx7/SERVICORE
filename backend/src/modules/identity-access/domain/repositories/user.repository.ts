import { User } from "../entities/user";
import { UserId } from "../value-objects/user-id";
import { Email } from "../value-objects/email";

/**
 * UserRepository Interface
 *
 * Define o contrato para persistência de usuários.
 * A implementação concreta fica na camada de infraestrutura.
 */
export interface UserRepository {
  /**
   * Salva um usuário (cria ou atualiza)
   * @param user Usuário a ser salvo
   */
  save(user: User): Promise<void>;

  /**
   * Busca um usuário por ID
   * @param id ID do usuário
   * @returns Usuário encontrado ou null
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * Busca um usuário por email
   * @param email Email do usuário
   * @returns Usuário encontrado ou null
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Verifica se um email já está em uso
   * @param email Email a ser verificado
   * @returns true se o email já estiver em uso
   */
  existsByEmail(email: Email): Promise<boolean>;

  /**
   * Remove um usuário
   * @param id ID do usuário
   */
  delete(id: UserId): Promise<void>;
}

