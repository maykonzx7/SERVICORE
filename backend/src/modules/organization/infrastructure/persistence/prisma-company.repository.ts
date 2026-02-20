import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { Prisma } from "@prisma/client";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { Company } from "../../domain/entities/company";
import { CompanyId } from "../../domain/value-objects/company-id";
import { UserId } from "@modules/identity-access/domain/value-objects/user-id";
import { CompanyMapper } from "../mappers/company.mapper";

/**
 * PrismaCompanyRepository
 *
 * Implementação do Repository usando Prisma.
 * Responsável por persistir e recuperar aggregates do banco de dados.
 */
@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Salva ou atualiza um aggregate
   * @param company Company a ser salva
   */
  async save(company: Company): Promise<void> {
    const data = CompanyMapper.toPersistence(company);

    await this.prisma.company.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        document: data.document,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        active: data.active,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        name: data.name,
        document: data.document,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        ownerId: data.ownerId,
        active: data.active,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    // TODO: Publicar eventos de domínio via RabbitMQ
    // const events = company.domainEvents;
    // await this.eventPublisher.publish(events);
    company.clearDomainEvents();
  }

  /**
   * Busca um aggregate pelo ID
   * @param id ID do aggregate
   * @returns Aggregate encontrado ou null
   */
  async findById(id: CompanyId): Promise<Company | null> {
    const data = await this.prisma.company.findUnique({
      where: { id: id.toString() },
    });

    if (!data) {
      return null;
    }

    return CompanyMapper.toDomain(data);
  }

  /**
   * Busca empresas por proprietário
   * @param ownerId ID do proprietário
   * @returns Lista de empresas
   */
  async findByOwnerId(ownerId: UserId): Promise<Company[]> {
    const data = await this.prisma.company.findMany({
      where: { ownerId: ownerId.toString() },
      orderBy: { createdAt: "desc" },
    });

    return data.map((item) => CompanyMapper.toDomain(item));
  }

  /**
   * Busca empresa por documento
   * @param document Documento da empresa
   * @returns Empresa encontrada ou null
   */
  async findByDocument(document: string): Promise<Company | null> {
    const data = await this.prisma.company.findUnique({
      where: { document },
    });

    if (!data) {
      return null;
    }

    return CompanyMapper.toDomain(data);
  }

  /**
   * Lista empresas com paginação e filtros
   */
  async findMany(params: {
    page?: number;
    limit?: number;
    search?: string;
    ownerId?: string;
    active?: boolean;
    document?: string;
    sortBy?: "name" | "createdAt" | "document";
    sortOrder?: "asc" | "desc";
  }): Promise<{
    companies: Company[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyWhereInput = {};

    if (params.ownerId) {
      where.ownerId = params.ownerId;
    }

    if (params.active !== undefined) {
      where.active = params.active;
    }

    if (params.document) {
      where.document = { contains: params.document, mode: "insensitive" };
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { document: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
        { city: { contains: params.search, mode: "insensitive" } },
        { state: { contains: params.search, mode: "insensitive" } },
      ];
    }

    // Ordenação
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder || "desc";
    const orderBy: Prisma.CompanyOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      companies: companies.map((item) => CompanyMapper.toDomain(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

