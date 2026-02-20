import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { ServiceOrderRepository } from "../../domain/repositories/service-order.repository";
import { ServiceOrder } from "../../domain/entities/service-order";
import { ServiceOrderId } from "../../domain/value-objects/service-order-id";
import { CompanyId } from "../../domain/value-objects/company-id";
import { ServiceOrderMapper } from "../mappers/service-order.mapper";

/**
 * PrismaServiceOrderRepository
 *
 * Implementação do Repository usando Prisma.
 * Responsável por persistir e recuperar aggregates do banco de dados.
 */
@Injectable()
export class PrismaServiceOrderRepository implements ServiceOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Salva ou atualiza um aggregate
   * @param order ServiceOrder a ser salvo
   */
  async save(order: ServiceOrder): Promise<void> {
    const data = ServiceOrderMapper.toPersistence(order);

    await this.prisma.serviceOrder.upsert({
      where: { id: data.id },
      update: {
        companyId: data.companyId,
        description: data.description,
        priority: data.priority,
        value: data.value,
        status: data.status,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        companyId: data.companyId,
        description: data.description,
        priority: data.priority,
        value: data.value,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    // TODO: Publicar eventos de domínio via RabbitMQ
    // Os eventos são processados no Use Case para evitar dependência circular
    order.clearDomainEvents();
  }

  /**
   * Busca um aggregate pelo ID
   * @param id ID do aggregate
   * @returns Aggregate encontrado ou null
   */
  async findById(id: ServiceOrderId): Promise<ServiceOrder | null> {
    const data = await this.prisma.serviceOrder.findUnique({
      where: { id: id.toString() },
    });

    if (!data) {
      return null;
    }

    return ServiceOrderMapper.toDomain(data);
  }

  /**
   * Busca todas as ordens de uma empresa
   * @param companyId ID da empresa
   * @returns Lista de ordens de serviço
   */
  async findByCompanyId(companyId: CompanyId): Promise<ServiceOrder[]> {
    const data = await this.prisma.serviceOrder.findMany({
      where: { companyId: companyId.toString() },
      orderBy: { createdAt: "desc" },
    });

    return data.map((item) => ServiceOrderMapper.toDomain(item));
  }

  /**
   * Remove um aggregate
   * @param id ID do aggregate a ser removido
   */
  async delete(id: ServiceOrderId): Promise<void> {
    await this.prisma.serviceOrder.delete({
      where: { id: id.toString() },
    });
  }

  /**
   * Verifica se um aggregate existe
   * @param id ID do aggregate
   * @returns true se o aggregate existir
   */
  async exists(id: ServiceOrderId): Promise<boolean> {
    const count = await this.prisma.serviceOrder.count({
      where: { id: id.toString() },
    });

    return count > 0;
  }
}
