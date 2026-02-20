import { Transaction } from "../../domain/entities/transaction";
import { Prisma } from "@prisma/client";

/**
 * TransactionMapper
 *
 * Responsável por mapear entre o modelo de domínio e o modelo de persistência.
 */
export class TransactionMapper {
  /**
   * Converte dados do Prisma para Aggregate de domínio
   */
  static toDomain(data: Prisma.TransactionGetPayload<{}>): Transaction {
    return Transaction.reconstitute(
      data.id,
      data.companyId,
      data.type,
      Number(data.amount),
      data.status,
      data.description,
      data.currency,
      data.serviceOrderId,
      data.paymentMethod,
      data.dueDate,
      data.rejectionReason,
      data.approvedBy,
      data.rejectedBy,
      data.processedAt,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Converte Aggregate de domínio para dados do Prisma
   */
  static toPersistence(transaction: Transaction): {
    id: string;
    companyId: string;
    type: string;
    amount: Prisma.Decimal;
    currency: string;
    description: string;
    status: string;
    serviceOrderId: string | null;
    paymentMethod: string | null;
    dueDate: Date | null;
    rejectionReason: string | null;
    approvedBy: string | null;
    rejectedBy: string | null;
    processedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: transaction.getId().toString(),
      companyId: transaction.companyId.toString(),
      type: transaction.type.toString(),
      amount: new Prisma.Decimal(transaction.amount.getAmount()),
      currency: transaction.currency,
      description: transaction.description,
      status: transaction.status.toString(),
      serviceOrderId: transaction.serviceOrderId?.toString() || null,
      paymentMethod: transaction.paymentMethod?.toString() || null,
      dueDate: transaction.dueDate,
      rejectionReason: transaction.rejectionReason,
      approvedBy: transaction.approvedBy,
      rejectedBy: transaction.rejectedBy,
      processedAt: transaction.processedAt,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}

