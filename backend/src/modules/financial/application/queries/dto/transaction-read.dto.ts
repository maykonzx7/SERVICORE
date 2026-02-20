/**
 * TransactionReadDto
 *
 * DTO para leitura de transações (Read Side)
 */
export class TransactionReadDto {
  id: string;
  companyId: string;
  type: string;
  amount: number;
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
}

