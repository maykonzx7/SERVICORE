import { AggregateRoot } from "@shared/domain/aggregate-root";
import { TransactionId } from "../value-objects/transaction-id";
import { TransactionType } from "../value-objects/transaction-type";
import { TransactionStatus } from "../value-objects/transaction-status";
import { PaymentMethod } from "../value-objects/payment-method";
import { Money } from "@modules/service-order/domain/value-objects/money";
import { CompanyId } from "@modules/service-order/domain/value-objects/company-id";
import { ServiceOrderId } from "@modules/service-order/domain/value-objects/service-order-id";
import { TransactionCreatedEvent } from "../events/transaction-created.event";
import { TransactionApprovedEvent } from "../events/transaction-approved.event";
import { TransactionRejectedEvent } from "../events/transaction-rejected.event";
import { TransactionProcessedEvent } from "../events/transaction-processed.event";
import { TransactionCancelledEvent } from "../events/transaction-cancelled.event";

/**
 * Transaction Aggregate Root
 *
 * Representa uma transação financeira no sistema.
 * É o Aggregate Root do módulo Financial.
 */
export class Transaction extends AggregateRoot {
  private constructor(
    id: TransactionId,
    private _companyId: CompanyId,
    private _type: TransactionType,
    private _amount: Money,
    private _status: TransactionStatus,
    private _description: string,
    private _currency: string,
    private _serviceOrderId: ServiceOrderId | null,
    private _paymentMethod: PaymentMethod | null,
    private _dueDate: Date | null,
    private _rejectionReason: string | null,
    private _approvedBy: string | null,
    private _rejectedBy: string | null,
    private _processedAt: Date | null,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id.toString());
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private _createdAt: Date;
  private _updatedAt: Date;

  /**
   * Factory method para criar uma nova transação
   */
  static create(
    companyId: CompanyId,
    type: TransactionType,
    amount: Money,
    description: string,
    currency: string = "BRL",
    serviceOrderId: ServiceOrderId | null = null,
    paymentMethod: PaymentMethod | null = null,
    dueDate: Date | null = null
  ): Transaction {
    // Validações
    if (!description || description.trim().length === 0) {
      throw new Error("Transaction description cannot be empty");
    }

    if (amount.isZero()) {
      throw new Error("Transaction amount cannot be zero");
    }

    const id = TransactionId.generate();
    const status = TransactionStatus.pending();
    const now = new Date();

    const transaction = new Transaction(
      id,
      companyId,
      type,
      amount,
      status,
      description,
      currency,
      serviceOrderId,
      paymentMethod,
      dueDate,
      null, // rejectionReason
      null, // approvedBy
      null, // rejectedBy
      null, // processedAt
      now,
      now
    );

    // Publicar evento de domínio
    transaction.addDomainEvent(
      new TransactionCreatedEvent(
        id.toString(),
        companyId.toString(),
        type.toString(),
        amount.getAmount(),
        currency
      )
    );

    return transaction;
  }

  /**
   * Factory method para reconstruir a partir de dados persistidos
   */
  static reconstitute(
    id: string,
    companyId: string,
    type: string,
    amount: number,
    status: string,
    description: string,
    currency: string,
    serviceOrderId: string | null,
    paymentMethod: string | null,
    dueDate: Date | null,
    rejectionReason: string | null,
    approvedBy: string | null,
    rejectedBy: string | null,
    processedAt: Date | null,
    createdAt: Date,
    updatedAt: Date
  ): Transaction {
    return new Transaction(
      TransactionId.create(id),
      CompanyId.create(companyId),
      TransactionType.create(type),
      Money.create(amount, currency),
      TransactionStatus.create(status),
      description,
      currency,
      serviceOrderId ? ServiceOrderId.create(serviceOrderId) : null,
      paymentMethod ? PaymentMethod.create(paymentMethod) : null,
      dueDate,
      rejectionReason,
      approvedBy,
      rejectedBy,
      processedAt,
      createdAt,
      updatedAt
    );
  }

  /**
   * Aprova a transação
   */
  approve(approvedBy: string): void {
    if (!this._status.canBeApproved()) {
      throw new Error(
        `Transaction cannot be approved. Current status: ${this._status.toString()}`
      );
    }

    this._status = TransactionStatus.approved();
    this._approvedBy = approvedBy;
    this._updatedAt = new Date();

    this.addDomainEvent(
      new TransactionApprovedEvent(
        this.id,
        approvedBy,
        this._amount.getAmount()
      )
    );
  }

  /**
   * Rejeita a transação
   */
  reject(rejectedBy: string, reason: string): void {
    if (!this._status.canBeRejected()) {
      throw new Error(
        `Transaction cannot be rejected. Current status: ${this._status.toString()}`
      );
    }

    this._status = TransactionStatus.rejected();
    this._rejectedBy = rejectedBy;
    this._rejectionReason = reason;
    this._updatedAt = new Date();

    this.addDomainEvent(
      new TransactionRejectedEvent(
        this.id,
        rejectedBy,
        reason,
        this._amount.getAmount()
      )
    );
  }

  /**
   * Processa a transação (efetiva o pagamento)
   */
  process(): void {
    if (!this._status.canBeProcessed()) {
      throw new Error(
        `Transaction cannot be processed. Current status: ${this._status.toString()}`
      );
    }

    this._status = TransactionStatus.processed();
    this._processedAt = new Date();
    this._updatedAt = new Date();

    this.addDomainEvent(
      new TransactionProcessedEvent(
        this.id,
        this._companyId.toString(),
        this._type.toString(),
        this._amount.getAmount(),
        this._currency
      )
    );
  }

  /**
   * Cancela a transação
   */
  cancel(): void {
    if (!this._status.canBeCancelled()) {
      throw new Error(
        `Transaction cannot be cancelled. Current status: ${this._status.toString()}`
      );
    }

    this._status = TransactionStatus.cancelled();
    this._updatedAt = new Date();

    this.addDomainEvent(
      new TransactionCancelledEvent(
        this.id,
        this._companyId.toString(),
        this._amount.getAmount()
      )
    );
  }

  /**
   * Atualiza o valor da transação (apenas se pendente)
   */
  updateAmount(newAmount: Money): void {
    if (!this._status.canBeEdited()) {
      throw new Error(
        `Transaction cannot be edited. Current status: ${this._status.toString()}`
      );
    }

    if (newAmount.isZero()) {
      throw new Error("Transaction amount cannot be zero");
    }

    this._amount = newAmount;
    this._updatedAt = new Date();
  }

  /**
   * Atualiza a descrição (apenas se pendente)
   */
  updateDescription(newDescription: string): void {
    if (!this._status.canBeEdited()) {
      throw new Error(
        `Transaction cannot be edited. Current status: ${this._status.toString()}`
      );
    }

    if (!newDescription || newDescription.trim().length === 0) {
      throw new Error("Transaction description cannot be empty");
    }

    this._description = newDescription;
    this._updatedAt = new Date();
  }

  /**
   * Atualiza o método de pagamento (apenas se pendente)
   */
  updatePaymentMethod(paymentMethod: PaymentMethod | null): void {
    if (!this._status.canBeEdited()) {
      throw new Error(
        `Transaction cannot be edited. Current status: ${this._status.toString()}`
      );
    }

    this._paymentMethod = paymentMethod;
    this._updatedAt = new Date();
  }

  /**
   * Atualiza a data de vencimento (apenas se pendente)
   */
  updateDueDate(dueDate: Date | null): void {
    if (!this._status.canBeEdited()) {
      throw new Error(
        `Transaction cannot be edited. Current status: ${this._status.toString()}`
      );
    }

    this._dueDate = dueDate;
    this._updatedAt = new Date();
  }

  /**
   * Atualiza a ordem de serviço associada (apenas se pendente)
   */
  updateServiceOrderId(serviceOrderId: ServiceOrderId | null): void {
    if (!this._status.canBeEdited()) {
      throw new Error(
        `Transaction cannot be edited. Current status: ${this._status.toString()}`
      );
    }

    this._serviceOrderId = serviceOrderId;
    this._updatedAt = new Date();
  }

  // Getters
  getId(): TransactionId {
    return TransactionId.create(this.id);
  }

  get transactionId(): TransactionId {
    return this.getId();
  }

  get companyId(): CompanyId {
    return this._companyId;
  }

  get type(): TransactionType {
    return this._type;
  }

  get amount(): Money {
    return this._amount;
  }

  get status(): TransactionStatus {
    return this._status;
  }

  get description(): string {
    return this._description;
  }

  get currency(): string {
    return this._currency;
  }

  get serviceOrderId(): ServiceOrderId | null {
    return this._serviceOrderId;
  }

  get paymentMethod(): PaymentMethod | null {
    return this._paymentMethod;
  }

  get dueDate(): Date | null {
    return this._dueDate;
  }

  get rejectionReason(): string | null {
    return this._rejectionReason;
  }

  get approvedBy(): string | null {
    return this._approvedBy;
  }

  get rejectedBy(): string | null {
    return this._rejectedBy;
  }

  get processedAt(): Date | null {
    return this._processedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}

