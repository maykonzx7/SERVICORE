import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user";
import { UserId } from "../../domain/value-objects/user-id";
import { Email } from "../../domain/value-objects/email";
import { UserMapper } from "../mappers/user.mapper";

/**
 * PrismaUserRepository
 *
 * Implementação do Repository usando Prisma.
 * Responsável por persistir e recuperar aggregates do banco de dados.
 */
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Salva ou atualiza um aggregate
   * @param user User a ser salvo
   */
  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);

    await this.prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email,
        password: data.password,
        name: data.name,
        roles: data.roles,
        active: data.active,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        email: data.email,
        password: data.password,
        name: data.name,
        roles: data.roles,
        active: data.active,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    // TODO: Publicar eventos de domínio via RabbitMQ
    // const events = user.domainEvents;
    // await this.eventPublisher.publish(events);
    user.clearDomainEvents();
  }

  /**
   * Busca um aggregate pelo ID
   * @param id ID do aggregate
   * @returns Aggregate encontrado ou null
   */
  async findById(id: UserId): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id: id.toString() },
    });

    if (!data) {
      return null;
    }

    return UserMapper.toDomain(data);
  }

  /**
   * Busca um aggregate por email
   * @param email Email do usuário
   * @returns Aggregate encontrado ou null
   */
  async findByEmail(email: Email): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email: email.toString() },
    });

    if (!data) {
      return null;
    }

    return UserMapper.toDomain(data);
  }

  /**
   * Verifica se um email já está em uso
   * @param email Email a ser verificado
   * @returns true se o email já estiver em uso
   */
  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.toString() },
    });

    return count > 0;
  }

  /**
   * Remove um aggregate
   * @param id ID do aggregate a ser removido
   */
  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.toString() },
    });
  }
}

