import { ServiceOrder } from "../../domain/entities/service-order";
import { Prisma } from "@prisma/client";

/**
 * ServiceOrderMapper
 *
 * Responsável por mapear entre o modelo de domínio e o modelo de persistência.
 * Isola a camada de domínio da estrutura do banco de dados.
 */
export class ServiceOrderMapper {
  /**
   * Converte dados do Prisma para Aggregate de domínio
   * @param data Dados do Prisma
   * @returns Aggregate de domínio
   */
  static toDomain(data: Prisma.ServiceOrderGetPayload<{}>): ServiceOrder {
    return ServiceOrder.reconstitute(
      data.id,
      data.companyId,
      data.description,
      data.priority,
      Number(data.value),
      data.status,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Converte Aggregate de domínio para dados do Prisma
   * @param order Aggregate de domínio
   * @returns Dados para persistência
   */
  static toPersistence(order: ServiceOrder): {
    id: string;
    companyId: string;
    description: string;
    priority: string;
    value: Prisma.Decimal;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: order.getId().toString(),
      companyId: order.companyId.toString(),
      description: order.description,
      priority: order.priority.toString(),
      value: new Prisma.Decimal(order.value.getAmount()),
      status: order.status.toString(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
