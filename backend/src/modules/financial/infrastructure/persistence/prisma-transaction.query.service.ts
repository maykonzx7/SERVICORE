import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { TransactionQueryServiceInterface } from "../../application/queries/transaction-query.service.interface";
import { TransactionReadDto } from "../../application/queries/dto/transaction-read.dto";
import { PaginatedResultDto, PaginationDto } from "@shared/application/dto";

@Injectable()
export class PrismaTransactionQueryService
  implements TransactionQueryServiceInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async findByCompanyId(
    companyId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>> {
    const pagination = new PaginationDto(page, limit);

    const total = await this.prisma.transaction.count({
      where: { companyId },
    });

    const transactions = await this.prisma.transaction.findMany({
      where: { companyId },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });

    pagination.total = total;

    return new PaginatedResultDto(
      transactions.map((t) => this.toDto(t)),
      pagination
    );
  }

  async findById(id: string): Promise<TransactionReadDto | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return null;
    }

    return this.toDto(transaction);
  }

  async findByType(
    type: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>> {
    const pagination = new PaginationDto(page, limit);

    const total = await this.prisma.transaction.count({
      where: { type, companyId },
    });

    const transactions = await this.prisma.transaction.findMany({
      where: { type, companyId },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });

    pagination.total = total;

    return new PaginatedResultDto(
      transactions.map((t) => this.toDto(t)),
      pagination
    );
  }

  async findByStatus(
    status: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>> {
    const pagination = new PaginationDto(page, limit);

    const total = await this.prisma.transaction.count({
      where: { status, companyId },
    });

    const transactions = await this.prisma.transaction.findMany({
      where: { status, companyId },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });

    pagination.total = total;

    return new PaginatedResultDto(
      transactions.map((t) => this.toDto(t)),
      pagination
    );
  }

  async findByServiceOrderId(
    serviceOrderId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>> {
    const pagination = new PaginationDto(page, limit);

    const total = await this.prisma.transaction.count({
      where: { serviceOrderId },
    });

    const transactions = await this.prisma.transaction.findMany({
      where: { serviceOrderId },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });

    pagination.total = total;

    return new PaginatedResultDto(
      transactions.map((t) => this.toDto(t)),
      pagination
    );
  }

  async findByDateRange(
    companyId: string,
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>> {
    const pagination = new PaginationDto(page, limit);

    const total = await this.prisma.transaction.count({
      where: {
        companyId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const transactions = await this.prisma.transaction.findMany({
      where: {
        companyId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });

    pagination.total = total;

    return new PaginatedResultDto(
      transactions.map((t) => this.toDto(t)),
      pagination
    );
  }

  async search(
    companyId: string,
    filters: {
      type?: string;
      status?: string;
      serviceOrderId?: string;
      paymentMethod?: string;
      startDate?: Date;
      endDate?: Date;
      search?: string;
    },
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>> {
    const pagination = new PaginationDto(page, limit);

    const where: Prisma.TransactionWhereInput = {
      companyId,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.serviceOrderId) {
      where.serviceOrderId = filters.serviceOrderId;
    }

    if (filters.paymentMethod) {
      where.paymentMethod = filters.paymentMethod;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    if (filters.search) {
      where.description = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    const total = await this.prisma.transaction.count({ where });

    const transactions = await this.prisma.transaction.findMany({
      where,
      skip: pagination.offset,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    });

    pagination.total = total;

    return new PaginatedResultDto(
      transactions.map((t) => this.toDto(t)),
      pagination
    );
  }

  async getBalance(
    companyId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    companyId: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    currency: string;
    period?: { startDate: Date; endDate: Date };
  }> {
    const where: Prisma.TransactionWhereInput = {
      companyId,
      status: "PROCESSED", // Apenas transações processadas afetam o saldo
    };

    if (startDate || endDate) {
      where.processedAt = {};
      if (startDate) {
        where.processedAt.gte = startDate;
      }
      if (endDate) {
        where.processedAt.lte = endDate;
      }
    }

    const [income, expense] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: "INCOME",
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: "EXPENSE",
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalIncome = Number(income._sum.amount || 0);
    const totalExpense = Number(expense._sum.amount || 0);
    const balance = totalIncome - totalExpense;

    return {
      companyId,
      totalIncome,
      totalExpense,
      balance,
      currency: "BRL",
      period:
        startDate && endDate ? { startDate, endDate } : undefined,
    };
  }

  async getSummary(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    companyId: string;
    period: { startDate: Date; endDate: Date };
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    pendingIncome: number;
    pendingExpense: number;
    transactionsCount: number;
    currency: string;
  }> {
    const where: Prisma.TransactionWhereInput = {
      companyId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [
      processedIncome,
      processedExpense,
      pendingIncome,
      pendingExpense,
      count,
    ] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: "INCOME",
          status: "PROCESSED",
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: "EXPENSE",
          status: "PROCESSED",
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: "INCOME",
          status: { in: ["PENDING", "APPROVED"] },
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: "EXPENSE",
          status: { in: ["PENDING", "APPROVED"] },
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const totalIncome = Number(processedIncome._sum.amount || 0);
    const totalExpense = Number(processedExpense._sum.amount || 0);
    const netBalance = totalIncome - totalExpense;
    const pendingIncomeAmount = Number(pendingIncome._sum.amount || 0);
    const pendingExpenseAmount = Number(pendingExpense._sum.amount || 0);

    return {
      companyId,
      period: { startDate, endDate },
      totalIncome,
      totalExpense,
      netBalance,
      pendingIncome: pendingIncomeAmount,
      pendingExpense: pendingExpenseAmount,
      transactionsCount: count,
      currency: "BRL",
    };
  }

  private toDto(data: Prisma.TransactionGetPayload<{}>): TransactionReadDto {
    return {
      id: data.id,
      companyId: data.companyId,
      type: data.type,
      amount: Number(data.amount),
      currency: data.currency,
      description: data.description,
      status: data.status,
      serviceOrderId: data.serviceOrderId,
      paymentMethod: data.paymentMethod,
      dueDate: data.dueDate,
      rejectionReason: data.rejectionReason,
      approvedBy: data.approvedBy,
      rejectedBy: data.rejectedBy,
      processedAt: data.processedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

