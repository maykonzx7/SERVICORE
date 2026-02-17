# Templates de Domínio

> Templates e exemplos para criar componentes do domínio

## 📋 Templates Disponíveis

Este diretório contém exemplos funcionais que podem ser copiados e adaptados para criar componentes do domínio.

---

## 🎯 Value Objects

### ID Value Object

**Arquivo:** `examples/example-id.value-object.ts`

```typescript
import { ValueObject } from "../../value-object";

export class ExampleId extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  static create(value: string): ExampleId {
    return new ExampleId(value);
  }

  static generate(): ExampleId {
    return new ExampleId(crypto.randomUUID());
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("ExampleId cannot be empty");
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: ExampleId): boolean {
    if (!other) return false;
    return this.value === other.value;
  }
}
```

**Como usar:**
1. Copie o exemplo
2. Substitua `ExampleId` pelo nome desejado (ex: `ServiceOrderId`)
3. Ajuste validações se necessário

---

### Email Value Object

**Arquivo:** `examples/email.value-object.ts`

```typescript
import { ValueObject } from "../../value-object";

export class Email extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  static create(value: string): Email {
    return new Email(value);
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("Email cannot be empty");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new Error("Invalid email format");
    }

    if (this.value.length > 255) {
      throw new Error("Email is too long");
    }
  }

  toString(): string {
    return this.value;
  }

  getDomain(): string {
    return this.value.split("@")[1];
  }

  equals(other: Email): boolean {
    if (!other) return false;
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
```

---

### Money Value Object

**Arquivo:** `examples/money.value-object.ts`

```typescript
import { ValueObject } from "../../value-object";

export class Money extends ValueObject {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = "BRL"
  ) {
    super();
    this.validate();
  }

  static create(amount: number, currency: string = "BRL"): Money {
    return new Money(amount, currency);
  }

  static zero(currency: string = "BRL"): Money {
    return new Money(0, currency);
  }

  private validate(): void {
    if (isNaN(this.amount) || !isFinite(this.amount)) {
      throw new Error("Money amount must be a valid number");
    }

    if (this.amount < 0) {
      throw new Error("Money amount cannot be negative");
    }

    if (!this.currency || this.currency.trim().length === 0) {
      throw new Error("Currency cannot be empty");
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add money with different currencies");
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot subtract money with different currencies");
    }
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error("Money result cannot be negative");
    }
    return new Money(result, this.currency);
  }

  equals(other: Money): boolean {
    if (!other) return false;
    return this.amount === other.amount && this.currency === other.currency;
  }

  isZero(): boolean {
    return this.amount === 0;
  }
}
```

---

## 🏗️ Aggregate Root

**Arquivo:** `examples/example.aggregate.ts`

```typescript
import { AggregateRoot } from "../../aggregate-root";
import { ExampleId } from "../value-objects/example-id";

export class Example extends AggregateRoot {
  private constructor(
    id: ExampleId,
    private _property1: string,
    private _property2: number
  ) {
    super(id.toString());
  }

  static create(property1: string, property2: number): Example {
    const id = ExampleId.generate();
    const entity = new Example(id, property1, property2);

    // Adicionar Domain Event se necessário
    // entity.addDomainEvent(new ExampleCreatedEvent(id.toString()));

    return entity;
  }

  static reconstitute(
    id: string,
    property1: string,
    property2: number,
    createdAt: Date,
    updatedAt: Date
  ): Example {
    const entity = new Example(ExampleId.create(id), property1, property2);
    return entity;
  }

  get id(): ExampleId {
    return ExampleId.create(super.id);
  }

  get property1(): string {
    return this._property1;
  }

  get property2(): number {
    return this._property2;
  }

  updateProperty1(newValue: string): void {
    if (!newValue || newValue.trim().length === 0) {
      throw new Error("Property1 cannot be empty");
    }

    this._property1 = newValue;
    this.markAsUpdated();

    // Adicionar Domain Event se necessário
    // this.addDomainEvent(new ExampleProperty1UpdatedEvent(this.id.toString()));
  }
}
```

---

## 📢 Domain Event

**Arquivo:** `examples/example-created.event.ts`

```typescript
import { DomainEvent } from "../../domain-event";

export class ExampleCreatedEvent extends DomainEvent {
  constructor(
    public readonly exampleId: string,
    public readonly property1: string
  ) {
    super();
  }

  get eventName(): string {
    return "ExampleCreated";
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      exampleId: this.exampleId,
      property1: this.property1,
    };
  }
}
```

---

## 💾 Repository Interface

**Arquivo:** `examples/example.repository.ts`

```typescript
import { Example } from "../entities/example";
import { ExampleId } from "../value-objects/example-id";

export interface ExampleRepository {
  save(entity: Example): Promise<void>;
  findById(id: ExampleId): Promise<Example | null>;
  findAll(): Promise<Example[]>;
  delete(id: ExampleId): Promise<void>;
  exists(id: ExampleId): Promise<boolean>;
}
```

---

## 📚 Guia de Uso

1. **Copie o exemplo** que mais se aproxima do que você precisa
2. **Renomeie** arquivo e classe
3. **Substitua** `Example` pelo nome da sua entidade
4. **Adapte** validações e métodos conforme necessário
5. **Adicione** Domain Events quando apropriado

---

## ✅ Checklist

Ao criar um novo componente do domínio:

- [ ] Value Objects são imutáveis
- [ ] Validações no construtor
- [ ] Factory methods implementados
- [ ] Método `equals()` implementado
- [ ] Aggregate Root tem factory methods (`create`, `reconstitute`)
- [ ] Métodos de negócio validam invariantes
- [ ] Domain Events publicados quando apropriado
- [ ] Repository Interface no domínio (implementação na infra)

---

**Nota:** Estes são exemplos funcionais. Adapte conforme as necessidades específicas de cada módulo.


