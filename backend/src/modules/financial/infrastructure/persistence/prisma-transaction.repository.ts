import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { Transaction } from "../../domain/entities/transaction";
import { TransactionId } from "../../domain/value-objects/transaction-id";
import { CompanyId } from "@modules/service-order/domain/value-objects/company-id";
import { ServiceOrderId } from "@modules/service-order/domain/value-objects/service-order-id";
import { TransactionType } from "../../domain/value-objects/transaction-type";
import { TransactionStatus } from "../../domain/value-objects/transaction-status";
import { TransactionMapper } from "../mappers/transaction.mapper";

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(transaction: Transaction): Promise<void> {
    const data = TransactionMapper.toPersistence(transaction);

    await this.prisma.transaction.upsert({
      where: { id: data.id },
      update: {
        companyId: data.companyId,
        type: data.type,
        amount: data.amount,
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
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        companyId: data.companyId,
        type: data.type,
        amount: data.amount,
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
      },
    });

    transaction.clearDomainEvents();
  }

  async findById(id: TransactionId): Promise<Transaction | null> {
    const data = await this.prisma.transaction.findUnique({
      where: { id: id.toString() },
    });

    if (!data) {
      return null;
    }

    return TransactionMapper.toDomain(data);
  }

  async findByCompanyId(companyId: CompanyId): Promise<Transaction[]> {
    const data = await this.prisma.transaction.findMany({
      where: { companyId: companyId.toString() },
      orderBy: { createdAt: "desc" },
    });

    return data.map((item) => TransactionMapper.toDomain(item));
  }

  async findByServiceOrderId(
    serviceOrderId: ServiceOrderId
  ): Promise<Transaction[]> {
    const data = await this.prisma.transaction.findMany({
      where: { serviceOrderId: serviceOrderId.toString() },
      orderBy: { createdAt: "desc" },
    });

    return data.map((item) => TransactionMapper.toDomain(item));
  }

  async findByType(
    type: TransactionType,
    companyId: CompanyId
  ): Promise<Transaction[]> {
    const data = await this.prisma.transaction.findMany({
      where: {
        type: type.toString(),
        companyId: companyId.toString(),
      },
      orderBy: { createdAt: "desc" },
    });

    return data.map((item) => TransactionMapper.toDomain(item));
  }

  async findByStatus(
    status: TransactionStatus,
    companyId: CompanyId
  ): Promise<Transaction[]> {
    const data = await this.prisma.transaction.findMany({
      where: {
        status: status.toString(),
        companyId: companyId.toString(),
      },
      orderBy: { createdAt: "desc" },
    });

    return data.map((item) => TransactionMapper.toDomain(item));
  }

  async findByDateRange(
    companyId: CompanyId,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const data = await this.prisma.transaction.findMany({
      where: {
        companyId: companyId.toString(),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return data.map((item) => TransactionMapper.toDomain(item));
  }

  async exists(id: TransactionId): Promise<boolean> {
    const count = await this.prisma.transaction.count({
      where: { id: id.toString() },
    });
    return count > 0;
  }
}

