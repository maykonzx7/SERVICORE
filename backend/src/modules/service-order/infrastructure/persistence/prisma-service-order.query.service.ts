import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { ServiceOrderQueryServiceInterface } from "../../application/queries/service-order-query.service.interface";
import { ServiceOrderReadDto } from "../../application/queries/dto/service-order-read.dto";
import { PaginatedResultDto, PaginationDto } from "@shared/application/dto";

/**
 * PrismaServiceOrderQueryService
 *
 * Implementação do Query Service usando Prisma.
 * Responsável por consultas otimizadas de leitura (Read Side).
 * NÃO trabalha com aggregates, apenas com DTOs.
 */
@Injectable()
export class PrismaServiceOrderQueryService implements ServiceOrderQueryServiceInterface {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca ordens de serviço por empresa com paginação
   * @param companyId ID da empresa
   * @param page Número da página
   * @param limit Itens por página
   * @returns Resultado paginado
   */
  async findByCompanyId(
    companyId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<ServiceOrderReadDto>> {
    const pagination = new PaginationDto(page, limit);

    // Buscar total de registros
    const total = await this.prisma.serviceOrder.count({
      where: { companyId },
    });

    // Buscar registros paginados
    const orders = await this.prisma.serviceOrder.findMany({
      where: { companyId },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });

    pagination.total = total;

    return new PaginatedResultDto(
      orders.map((order) => this.toDto(order)),
      pagination
    );
  }

  /**
   * Busca uma ordem de serviço por ID
   * @param id ID da ordem
   * @returns DTO da ordem ou null
   */
  async findById(id: string): Promise<ServiceOrderReadDto | null> {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { id },
    });

    if (!order) {
      return null;
    }

    return this.toDto(order);
  }

  /**
   * Busca ordens por status
   * @param status Status da ordem
   * @param page Número da página
   * @param limit Itens por página
   * @returns Resultado paginado
   */
  async findByStatus(
    status: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<ServiceOrderReadDto>> {
    const pagination = new PaginationDto(page, limit);

    const total = await this.prisma.serviceOrder.count({
      where: { status },
    });

    const orders = await this.prisma.serviceOrder.findMany({
      where: { status },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });

    pagination.total = total;

    return new PaginatedResultDto(
      orders.map((order) => this.toDto(order)),
      pagination
    );
  }

  /**
   * Busca ordens por prioridade
   * @param priority Prioridade
   * @param page Número da página
   * @param limit Itens por página
   * @returns Resultado paginado
   */
  async findByPriority(
    priority: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<ServiceOrderReadDto>> {
    const pagination = new PaginationDto(page, limit);

    const total = await this.prisma.serviceOrder.count({
      where: { priority },
    });

    const orders = await this.prisma.serviceOrder.findMany({
      where: { priority },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });

    pagination.total = total;

    return new PaginatedResultDto(
      orders.map((order) => this.toDto(order)),
      pagination
    );
  }

  /**
   * Converte dados do Prisma para DTO
   * @param data Dados do Prisma
   * @returns DTO de leitura
   */
  private toDto(data: {
    id: string;
    companyId: string;
    description: string;
    priority: string;
    value: Prisma.Decimal | number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): ServiceOrderReadDto {
    return {
      id: data.id,
      companyId: data.companyId,
      description: data.description,
      priority: data.priority,
      value: Number(data.value),
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
