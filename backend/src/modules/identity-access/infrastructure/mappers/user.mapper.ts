import { User } from "../../domain/entities/user";
import { Prisma } from "@prisma/client";

/**
 * UserMapper
 *
 * Responsável por converter entre a camada de domínio e a camada de persistência.
 */
export class UserMapper {
  /**
   * Converte um Aggregate do domínio para o formato de persistência
   * @param user Aggregate User
   * @returns Dados no formato do Prisma
   */
  static toPersistence(user: User): Prisma.UserCreateInput {
    return {
      id: user.id,
      email: user.email.toString(),
      password: user.getHashedPassword(),
      name: user.name,
      roles: user.roles.map((r) => r.toString()),
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Converte dados do Prisma para um Aggregate do domínio
   * @param data Dados do Prisma
   * @returns Aggregate User
   */
  static toDomain(data: {
    id: string;
    email: string;
    password: string;
    name: string | null;
    roles: string[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.reconstitute(
      data.id,
      data.email,
      data.password,
      data.name,
      data.roles,
      data.active,
      data.createdAt,
      data.updatedAt
    );
  }
}

