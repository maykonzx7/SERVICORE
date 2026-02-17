import { ValueObject } from "@shared/domain/value-object";
import * as bcrypt from "bcryptjs";

/**
 * Password Value Object
 *
 * Representa uma senha do usuário (sempre hasheada)
 */
export class Password extends ValueObject {
  private constructor(private readonly hashedValue: string) {
    super();
  }

  /**
   * Cria uma senha a partir de um valor em texto plano
   * A senha será automaticamente hasheada
   * @param plainPassword Senha em texto plano
   * @returns Instância de Password
   * @throws Error se a senha não atender aos requisitos
   */
  static async create(plainPassword: string): Promise<Password> {
    Password.validate(plainPassword);
    const hashedValue = await bcrypt.hash(plainPassword, 10);
    return new Password(hashedValue);
  }

  /**
   * Cria uma senha a partir de um valor já hasheado
   * Usado para reconstruir a senha do banco de dados
   * @param hashedValue Senha já hasheada
   * @returns Instância de Password
   */
  static fromHash(hashedValue: string): Password {
    return new Password(hashedValue);
  }

  /**
   * Valida os requisitos da senha
   * @param plainPassword Senha em texto plano
   * @throws Error se a senha não atender aos requisitos
   */
  private static validate(plainPassword: string): void {
    if (!plainPassword || plainPassword.trim().length === 0) {
      throw new Error("Password cannot be empty");
    }

    if (plainPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  }

  /**
   * Compara a senha com um valor em texto plano
   * @param plainPassword Senha em texto plano
   * @returns true se a senha corresponder
   */
  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hashedValue);
  }

  /**
   * Retorna o valor hasheado (apenas para persistência)
   * NUNCA exponha isso em respostas da API
   */
  getHashedValue(): string {
    return this.hashedValue;
  }

  /**
   * Compara duas senhas
   * @param other Outra Password
   * @returns true se as senhas forem iguais
   */
  equals(other: Password): boolean {
    if (!other) {
      return false;
    }
    return this.hashedValue === other.hashedValue;
  }
}

