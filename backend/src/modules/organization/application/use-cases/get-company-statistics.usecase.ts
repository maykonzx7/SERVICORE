import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { CompanyId } from "../../domain/value-objects/company-id";
import { PrismaService } from "@shared/infrastructure/prisma.service";

export interface GetCompanyStatisticsInput {
  companyId: string;
}

export interface CompanyStatistics {
  totalUsers: number;
  totalServiceOrders: number;
  totalCompletedOrders: number;
  totalRevenue: number;
  totalTransactions: number;
  activeUsers: number;
  pendingOrders: number;
}

export class GetCompanyStatisticsUseCase extends BaseUseCase<
  GetCompanyStatisticsInput,
  CompanyStatistics
> {
  constructor(
    private readonly repository: CompanyRepository,
    private readonly prisma: PrismaService
  ) {
    super();
  }

  async execute(
    input: GetCompanyStatisticsInput
  ): Promise<Result<CompanyStatistics>> {
    try {
      const companyId = CompanyId.create(input.companyId);

      // Verificar se a empresa existe
      const company = await this.repository.findById(companyId);
      if (!company) {
        return this.failure("Company not found");
      }

      // Buscar estatísticas do banco de dados
      const [
        totalUsers,
        totalServiceOrders,
        completedOrders,
        revenueData,
        totalTransactions,
        activeUsers,
        pendingOrders,
      ] = await Promise.all([
        // Total de usuários (assumindo que há uma relação User-Company)
        this.prisma.user.count({
          where: {
            // Nota: Ajustar conforme estrutura real de relacionamento
            // Por enquanto, retornamos 0 se não houver relação direta
          },
        }),

        // Total de ordens de serviço
        this.prisma.serviceOrder.count({
          where: { companyId: input.companyId },
        }),

        // Ordens completadas
        this.prisma.serviceOrder.count({
          where: {
            companyId: input.companyId,
            status: "COMPLETED",
          },
        }),

        // Receita total (soma de valores de ordens completadas)
        this.prisma.serviceOrder.aggregate({
          where: {
            companyId: input.companyId,
            status: "COMPLETED",
          },
          _sum: {
            value: true,
          },
        }),

        // Total de transações (assumindo que há uma tabela Transaction)
        // Por enquanto retornamos 0 se não existir
        Promise.resolve(0),

        // Usuários ativos
        this.prisma.user.count({
          where: {
            active: true,
            // Ajustar conforme estrutura real
          },
        }),

        // Ordens pendentes
        this.prisma.serviceOrder.count({
          where: {
            companyId: input.companyId,
            status: {
              in: ["CREATED", "STARTED", "IN_PROGRESS"],
            },
          },
        }),
      ]);

      const statistics: CompanyStatistics = {
        totalUsers,
        totalServiceOrders,
        totalCompletedOrders: completedOrders,
        totalRevenue: Number(revenueData._sum.value || 0),
        totalTransactions,
        activeUsers,
        pendingOrders,
      };

      return this.success(statistics);
    } catch (error) {
      return this.failure(
        error instanceof Error
          ? error.message
          : "Failed to get company statistics"
      );
    }
  }
}

