# ServiCore — Processo Completo de Desenvolvimento

> Guia passo a passo do desenvolvimento do início ao fim, seguindo DDD + Hexagonal + CQRS Leve

**📘 Documento Relacionado:** Para ver o mapeamento completo de funcionalidades e como implementá-las, consulte **[Plano Integrado de Desenvolvimento](./docs/INTEGRATED_DEVELOPMENT_PLAN.md)**

---

# 📋 Índice

1. [Pré-requisitos e Setup Inicial](#1-pré-requisitos-e-setup-inicial)
2. [Fase 0: Preparação do Ambiente](#2-fase-0-preparação-do-ambiente)
3. [Fase 1: Modelagem Estratégica (DDD)](#3-fase-1-modelagem-estratégica-ddd)
4. [Fase 2: Implementação da Base Compartilhada](#4-fase-2-implementação-da-base-compartilhada)
5. [Fase 3: Desenvolvimento do Domínio](#5-fase-3-desenvolvimento-do-domínio)
6. [Fase 4: Desenvolvimento da Camada de Aplicação](#6-fase-4-desenvolvimento-da-camada-de-aplicação)
7. [Fase 5: Desenvolvimento da Infraestrutura](#7-fase-5-desenvolvimento-da-infraestrutura)
8. [Fase 6: Desenvolvimento da Apresentação](#8-fase-6-desenvolvimento-da-apresentação)
9. [Fase 7: Desenvolvimento do Frontend](#9-fase-7-desenvolvimento-do-frontend)
10. [Fase 8: Testes e Qualidade](#10-fase-8-testes-e-qualidade)
11. [Fase 9: Integração e Deploy](#11-fase-9-integração-e-deploy)
12. [Fase 10: Manutenção e Evolução](#12-fase-10-manutenção-e-evolução)

---

# 1️⃣ Pré-requisitos e Setup Inicial

## 1.1 Ferramentas Necessárias

### Backend

- **Node.js** 18.x ou superior
- **npm** ou **yarn**
- **PostgreSQL** 14+ (ou Docker)
- **Redis** 6+ (ou Docker)
- **RabbitMQ** 3.9+ (ou Docker)
- **Prisma CLI**

### Frontend

- **Node.js** 18.x ou superior
- **npm** ou **yarn**

### DevOps

- **Docker** e **Docker Compose**
- **Git**
- **GitHub Actions** (ou CI/CD de preferência)

### Desenvolvimento

- **VS Code** (recomendado)
- **Extensões:**
  - ESLint
  - Prettier
  - Prisma
  - TypeScript

---

## 1.2 Estrutura de Pastas Inicial

```bash
# Criar estrutura base
mkdir -p servicore/{backend,frontend,docs,docker,.github/workflows}
cd servicore

# Backend
mkdir -p backend/src/{shared,modules,config}
mkdir -p backend/prisma

# Frontend
mkdir -p frontend/src/{modules,shared,router,stores}

# Docs
mkdir -p docs/ADR
```

---

# 2️⃣ Fase 0: Preparação do Ambiente

## 2.1 Inicialização do Projeto Backend

```bash
cd backend
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express
npm install -D @types/node typescript ts-node
npm install prisma @prisma/client
npm install class-validator class-transformer
npm install ioredis
npm install amqplib
```

## 2.2 Configuração TypeScript

**`backend/tsconfig.json`:**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@shared/*": ["src/shared/*"],
      "@modules/*": ["src/modules/*"]
    }
  }
}
```

## 2.3 Configuração Docker Compose

**`docker/docker-compose.yml`:**

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: servicore
      POSTGRES_PASSWORD: servicore_dev
      POSTGRES_DB: servicore_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3.9-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: servicore
      RABBITMQ_DEFAULT_PASS: servicore_dev
```

## 2.4 Inicialização do Prisma

```bash
cd backend
npx prisma init
```

**Configurar `backend/prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 2.5 Variáveis de Ambiente

**`.env.example`:**

```env
# Database
DATABASE_URL="postgresql://servicore:servicore_dev@localhost:5432/servicore_dev?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_URL=amqp://servicore:servicore_dev@localhost:5672

# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
```

---

# 3️⃣ Fase 1: Modelagem Estratégica (DDD)

## 3.1 Identificação de Bounded Contexts

### Passo 1: Análise do Domínio

1. **Reunião com Domain Experts**
2. **Identificação de Subdomínios:**
   - Core: Service Order, Financial
   - Supporting: Identity & Access, Organization
   - Generic: Notifications, Reports

### Passo 2: Mapeamento de Contextos

**Documento criado: `docs/DDD_STRATEGIC.md`**

Este documento contém:

- Mapeamento completo de todos os Bounded Contexts
- Context Map visual
- Dependências entre contextos
- Subdomínios (Core, Supporting, Generic)
- Padrões de integração
- Decisões estratégicas

**Bounded Contexts identificados:**

1. **Identity & Access** - Autenticação e Autorização (Supporting)
2. **Organization** - Multi-tenant, Empresas (Supporting)
3. **Service Order** - Ordens de Serviço (Core)
4. **Financial** - Financeiro, Pagamentos (Core)
5. **Notifications** - Sistema de notificações (Generic - Futuro)
6. **Reports** - Relatórios e análises (Generic - Futuro)

## 3.2 Definição da Linguagem Ubíqua

**Documento criado: `docs/UBIQUITOUS_LANGUAGE.md`**

Este documento contém:

- Glossário completo de termos do domínio
- Definições detalhadas para cada conceito
- Regras de negócio associadas
- Convenções de nomenclatura
- Termos a evitar

**Principais termos definidos:**

- **Identity & Access:** User, Role, Permission, Session, Authentication, Authorization
- **Organization:** Company, Tenant, Department, OrganizationSettings
- **Service Order:** ServiceOrder, Priority, Status, Money, Assignment, History
- **Financial:** Transaction, Payment, Invoice, Receivable, Payable, Balance
- **Compartilhados:** ID, CreatedAt, UpdatedAt, Active, Domain Event

## 3.3 Identificação de Aggregates

**Documento criado: `docs/AGGREGATES.md`**

Este documento contém:

- Mapeamento detalhado de todos os Aggregates
- Entities e Value Objects de cada Aggregate
- Domain Events completos
- Repository Interfaces
- Regras de invariantes
- Máquinas de estado (quando aplicável)

**Aggregates identificados por contexto:**

**Identity & Access:**

- `User` (Aggregate Root)
- `Role` (Aggregate Root - opcional)

**Organization:**

- `Company` (Aggregate Root)
- `OrganizationSettings` (Aggregate Root)

**Service Order:**

- `ServiceOrder` (Aggregate Root) - com máquina de estados complexa

**Financial:**

- `Transaction` (Aggregate Root)
- `Invoice` (Aggregate Root)
- `Balance` (Aggregate Root)

**Para cada Aggregate, foram identificados:**

1. **Aggregate Roots** - Entidades principais
2. **Entities** - Entidades dentro dos boundaries
3. **Value Objects** - Objetos de valor imutáveis
4. **Domain Events** - Eventos significativos
5. **Repository Interfaces** - Contratos de persistência
6. **Regras de Invariantes** - Regras que devem ser sempre verdadeiras

---

# 4️⃣ Fase 2: Implementação da Base Compartilhada

## 4.1 Base Entity

**`backend/src/shared/domain/base-entity.ts`:**

```typescript
export abstract class BaseEntity {
  protected _id: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id: string) {
    this._id = id;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected markAsUpdated(): void {
    this._updatedAt = new Date();
  }

  equals(entity: BaseEntity): boolean {
    return this._id === entity._id;
  }
}
```

## 4.2 Aggregate Root

**`backend/src/shared/domain/aggregate-root.ts`:**

```typescript
import { BaseEntity } from "./base-entity";
import { DomainEvent } from "./domain-event";

export abstract class AggregateRoot extends BaseEntity {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
```

## 4.3 Value Object Base

**`backend/src/shared/domain/value-object.ts`:**

```typescript
export abstract class ValueObject {
  equals(other: ValueObject): boolean {
    return JSON.stringify(this) === JSON.stringify(other);
  }
}
```

## 4.4 Domain Event

**`backend/src/shared/domain/domain-event.ts`:**

```typescript
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor() {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
  }

  abstract get eventName(): string;
}
```

## 4.5 Result Pattern

**`backend/src/shared/application/result.ts`:**

```typescript
export class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _error?: string,
    private readonly _value?: T
  ) {}

  static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, undefined, value);
  }

  static fail<T>(error: string): Result<T> {
    return new Result<T>(false, error);
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get error(): string {
    return this._error!;
  }

  get value(): T {
    return this._value!;
  }
}
```

## 4.6 Serviços de Infraestrutura Base

**`backend/src/shared/infrastructure/prisma.service.ts`:**

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

---

# 5️⃣ Fase 3: Desenvolvimento do Domínio

## 5.1 Processo por Módulo

### Passo 1: Criar Estrutura de Pastas

```bash
mkdir -p backend/src/modules/service-order/domain/{entities,value-objects,events,repositories}
```

### Passo 2: Implementar Value Objects (Primeiro)

**Ordem de implementação:**

1. Value Objects simples (IDs, tipos primitivos)
2. Value Objects complexos (Money, Address)
3. Value Objects compostos

**Exemplo: `backend/src/modules/service-order/domain/value-objects/service-order-id.ts`:**

```typescript
import { ValueObject } from "@shared/domain/value-object";

export class ServiceOrderId extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate();
  }

  static create(value: string): ServiceOrderId {
    return new ServiceOrderId(value);
  }

  static generate(): ServiceOrderId {
    return new ServiceOrderId(crypto.randomUUID());
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("ServiceOrderId cannot be empty");
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: ServiceOrderId): boolean {
    return this.value === other.value;
  }
}
```

### Passo 3: Implementar Entities

**Exemplo: `backend/src/modules/service-order/domain/entities/service-order.ts`:**

```typescript
import { AggregateRoot } from "@shared/domain/aggregate-root";
import { ServiceOrderId } from "../value-objects/service-order-id";
import { CompanyId } from "../value-objects/company-id";
import { Priority } from "../value-objects/priority";
import { Money } from "../value-objects/money";
import { ServiceOrderCreatedEvent } from "../events/service-order-created.event";

export class ServiceOrder extends AggregateRoot {
  private constructor(
    id: ServiceOrderId,
    private _companyId: CompanyId,
    private _description: string,
    private _priority: Priority,
    private _value: Money,
    private _status: string
  ) {
    super(id.toString());
  }

  static create(
    companyId: CompanyId,
    description: string,
    priority: Priority,
    value: Money
  ): ServiceOrder {
    const id = ServiceOrderId.generate();
    const order = new ServiceOrder(
      id,
      companyId,
      description,
      priority,
      value,
      "CREATED"
    );

    order.addDomainEvent(
      new ServiceOrderCreatedEvent(id.toString(), companyId.toString())
    );

    return order;
  }

  start(): void {
    if (this._status !== "CREATED") {
      throw new Error("Service order can only be started if status is CREATED");
    }
    this._status = "STARTED";
    this.markAsUpdated();
  }

  // ... outros métodos de domínio
}
```

### Passo 4: Definir Domain Events

**Exemplo: `backend/src/modules/service-order/domain/events/service-order-created.event.ts`:**

```typescript
import { DomainEvent } from "@shared/domain/domain-event";

export class ServiceOrderCreatedEvent extends DomainEvent {
  constructor(
    public readonly serviceOrderId: string,
    public readonly companyId: string
  ) {
    super();
  }

  get eventName(): string {
    return "ServiceOrderCreated";
  }
}
```

### Passo 5: Definir Repository Interface

**Exemplo: `backend/src/modules/service-order/domain/repositories/service-order.repository.ts`:**

```typescript
import { ServiceOrder } from "../entities/service-order";
import { ServiceOrderId } from "../value-objects/service-order-id";

export interface ServiceOrderRepository {
  save(order: ServiceOrder): Promise<void>;
  findById(id: ServiceOrderId): Promise<ServiceOrder | null>;
  findByCompanyId(companyId: string): Promise<ServiceOrder[]>;
  delete(id: ServiceOrderId): Promise<void>;
}
```

## 5.2 Testes do Domínio

**Criar testes unitários para cada componente:**

```typescript
// service-order-id.spec.ts
describe("ServiceOrderId", () => {
  it("should create a valid ServiceOrderId", () => {
    const id = ServiceOrderId.create("valid-id");
    expect(id.toString()).toBe("valid-id");
  });

  it("should throw error for empty id", () => {
    expect(() => ServiceOrderId.create("")).toThrow();
  });
});
```

---

# 6️⃣ Fase 4: Desenvolvimento da Camada de Aplicação

## 6.1 Write Side (Use Cases)

### Passo 1: Criar Use Case

**`backend/src/modules/service-order/application/use-cases/create-service-order.usecase.ts`:**

```typescript
import { Injectable } from "@nestjs/common";
import { ServiceOrderRepository } from "../../domain/repositories/service-order.repository";
import { ServiceOrder } from "../../domain/entities/service-order";
import { CompanyId } from "../../domain/value-objects/company-id";
import { Priority } from "../../domain/value-objects/priority";
import { Money } from "../../domain/value-objects/money";
import { Result } from "@shared/application/result";

@Injectable()
export class CreateServiceOrderUseCase {
  constructor(private readonly repository: ServiceOrderRepository) {}

  async execute(input: {
    companyId: string;
    description: string;
    priority: string;
    value: number;
  }): Promise<Result<ServiceOrder>> {
    try {
      const companyId = CompanyId.create(input.companyId);
      const priority = Priority.create(input.priority);
      const money = Money.create(input.value);

      const serviceOrder = ServiceOrder.create(
        companyId,
        input.description,
        priority,
        money
      );

      await this.repository.save(serviceOrder);

      return Result.ok(serviceOrder);
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}
```

### Passo 2: Testar Use Case

```typescript
describe("CreateServiceOrderUseCase", () => {
  it("should create a service order", async () => {
    const mockRepository = {
      save: jest.fn(),
    };

    const useCase = new CreateServiceOrderUseCase(mockRepository);
    const result = await useCase.execute({
      companyId: "company-1",
      description: "Test order",
      priority: "HIGH",
      value: 100.0,
    });

    expect(result.isSuccess).toBe(true);
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

## 6.2 Read Side (Queries)

### Passo 1: Criar DTO de Leitura

**`backend/src/modules/service-order/application/queries/dto/service-order-read.dto.ts`:**

```typescript
export class ServiceOrderReadDto {
  id: string;
  companyId: string;
  description: string;
  priority: string;
  value: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Passo 2: Criar Query Handler

**`backend/src/modules/service-order/application/queries/list-service-orders.query.ts`:**

```typescript
import { Injectable } from "@nestjs/common";
import { ServiceOrderReadDto } from "./dto/service-order-read.dto";
import { ServiceOrderQueryService } from "../../infrastructure/persistence/prisma-service-order.query.service";

@Injectable()
export class ListServiceOrdersQuery {
  constructor(private readonly queryService: ServiceOrderQueryService) {}

  async execute(
    companyId: string,
    page: number,
    limit: number
  ): Promise<ServiceOrderReadDto[]> {
    return this.queryService.findByCompanyId(companyId, page, limit);
  }
}
```

### Passo 3: Criar Interface do Query Service

**`backend/src/modules/service-order/application/queries/service-order-query.service.interface.ts`:**

```typescript
import { ServiceOrderReadDto } from "./dto/service-order-read.dto";

export interface ServiceOrderQueryServiceInterface {
  findByCompanyId(
    companyId: string,
    page: number,
    limit: number
  ): Promise<ServiceOrderReadDto[]>;
  findById(id: string): Promise<ServiceOrderReadDto | null>;
}
```

---

# 7️⃣ Fase 5: Desenvolvimento da Infraestrutura

## 7.1 Repository Implementation (Write Side)

**`backend/src/modules/service-order/infrastructure/persistence/prisma-service-order.repository.ts`:**

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { ServiceOrderRepository } from "../../domain/repositories/service-order.repository";
import { ServiceOrder } from "../../domain/entities/service-order";
import { ServiceOrderId } from "../../domain/value-objects/service-order-id";
import { ServiceOrderMapper } from "../mappers/service-order.mapper";

@Injectable()
export class PrismaServiceOrderRepository implements ServiceOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(order: ServiceOrder): Promise<void> {
    const data = ServiceOrderMapper.toPersistence(order);

    await this.prisma.serviceOrder.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });

    // Publicar eventos de domínio
    const events = order.domainEvents;
    // ... publicar eventos via RabbitMQ
    order.clearDomainEvents();
  }

  async findById(id: ServiceOrderId): Promise<ServiceOrder | null> {
    const data = await this.prisma.serviceOrder.findUnique({
      where: { id: id.toString() },
    });

    if (!data) return null;

    return ServiceOrderMapper.toDomain(data);
  }

  // ... outros métodos
}
```

## 7.2 Query Service Implementation (Read Side)

**`backend/src/modules/service-order/infrastructure/persistence/prisma-service-order.query.service.ts`:**

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { ServiceOrderQueryServiceInterface } from "../../application/queries/service-order-query.service.interface";
import { ServiceOrderReadDto } from "../../application/queries/dto/service-order-read.dto";

@Injectable()
export class PrismaServiceOrderQueryService
  implements ServiceOrderQueryServiceInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async findByCompanyId(
    companyId: string,
    page: number,
    limit: number
  ): Promise<ServiceOrderReadDto[]> {
    const orders = await this.prisma.serviceOrder.findMany({
      where: { companyId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return orders.map(this.toDto);
  }

  async findById(id: string): Promise<ServiceOrderReadDto | null> {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { id },
    });

    if (!order) return null;

    return this.toDto(order);
  }

  private toDto(data: any): ServiceOrderReadDto {
    return {
      id: data.id,
      companyId: data.companyId,
      description: data.description,
      priority: data.priority,
      value: data.value,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
```

## 7.3 Mapper (Domain ↔ Persistence)

**`backend/src/modules/service-order/infrastructure/mappers/service-order.mapper.ts`:**

```typescript
import { ServiceOrder } from "../../domain/entities/service-order";
import { ServiceOrderId } from "../../domain/value-objects/service-order-id";
import { CompanyId } from "../../domain/value-objects/company-id";
import { Priority } from "../../domain/value-objects/priority";
import { Money } from "../../domain/value-objects/money";

export class ServiceOrderMapper {
  static toDomain(data: any): ServiceOrder {
    // Reconstruir Aggregate a partir dos dados do banco
    // ...
  }

  static toPersistence(order: ServiceOrder): any {
    return {
      id: order.id,
      companyId: order.companyId.toString(),
      description: order.description,
      priority: order.priority.toString(),
      value: order.value.amount,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
```

## 7.4 Atualizar Prisma Schema

**`backend/prisma/schema.prisma`:**

```prisma
model ServiceOrder {
  id          String   @id @default(uuid())
  companyId   String
  description String
  priority    String
  value       Decimal  @db.Decimal(10, 2)
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([companyId])
  @@index([status])
}
```

**Executar migração:**

```bash
npx prisma migrate dev --name create_service_order
```

---

# 8️⃣ Fase 6: Desenvolvimento da Apresentação

## 8.1 Controller (Write)

**`backend/src/modules/service-order/presentation/controllers/service-order.controller.ts`:**

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { CreateServiceOrderUseCase } from "../../application/use-cases/create-service-order.usecase";
import { CreateServiceOrderDto } from "../dtos/create-service-order.dto";

@Controller("service-orders")
export class ServiceOrderController {
  constructor(private readonly createUseCase: CreateServiceOrderUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateServiceOrderDto) {
    const result = await this.createUseCase.execute(dto);

    if (result.isFailure) {
      throw new Error(result.error);
    }

    return result.value;
  }
}
```

## 8.2 DTOs de Apresentação

**`backend/src/modules/service-order/presentation/dtos/create-service-order.dto.ts`:**

```typescript
import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateServiceOrderDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
```

## 8.3 Controller (Read)

```typescript
import { Controller, Get, Query, Param } from "@nestjs/common";
import { ListServiceOrdersQuery } from "../../application/queries/list-service-orders.query";
import { GetServiceOrderDetailsQuery } from "../../application/queries/get-service-order-details.query";

@Controller("service-orders")
export class ServiceOrderQueryController {
  constructor(
    private readonly listQuery: ListServiceOrdersQuery,
    private readonly getDetailsQuery: GetServiceOrderDetailsQuery
  ) {}

  @Get()
  async list(
    @Query("companyId") companyId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return this.listQuery.execute(companyId, page, limit);
  }

  @Get(":id")
  async getDetails(@Param("id") id: string) {
    return this.getDetailsQuery.execute(id);
  }
}
```

## 8.4 Módulo NestJS

**`backend/src/modules/service-order/service-order.module.ts`:**

```typescript
import { Module } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { ServiceOrderController } from "./presentation/controllers/service-order.controller";
import { CreateServiceOrderUseCase } from "./application/use-cases/create-service-order.usecase";
import { PrismaServiceOrderRepository } from "./infrastructure/persistence/prisma-service-order.repository";
import { ServiceOrderRepository } from "./domain/repositories/service-order.repository";
import { PrismaServiceOrderQueryService } from "./infrastructure/persistence/prisma-service-order.query.service";
import { ListServiceOrdersQuery } from "./application/queries/list-service-orders.query";

@Module({
  controllers: [ServiceOrderController],
  providers: [
    PrismaService,
    {
      provide: "ServiceOrderRepository",
      useClass: PrismaServiceOrderRepository,
    },
    {
      provide: CreateServiceOrderUseCase,
      useFactory: (repository: ServiceOrderRepository) => {
        return new CreateServiceOrderUseCase(repository);
      },
      inject: ["ServiceOrderRepository"],
    },
    PrismaServiceOrderQueryService,
    ListServiceOrdersQuery,
  ],
})
export class ServiceOrderModule {}
```

---

# 9️⃣ Fase 7: Desenvolvimento do Frontend

> **📘 Guia Completo:** Para detalhes completos sobre desenvolvimento frontend, consulte [`docs/FRONTEND_DEVELOPMENT_GUIDE.md`](./docs/FRONTEND_DEVELOPMENT_GUIDE.md)
>
> O guia inclui:
> - Ordem de implementação integrada com backend
> - Estrutura completa de pastas
> - Padrões de código detalhados
> - Desenvolvimento com mocks
> - Checklist completo por fase

## 9.1 Setup Inicial

```bash
cd frontend
npm create vite@latest . -- --template vue-ts
npm install vue-router@4 pinia axios
npm install -D @types/node
```

## 9.2 Estrutura de Pastas

```
frontend/src/
├── modules/
│   ├── service-orders/
│   │   ├── components/
│   │   ├── views/
│   │   └── stores/
│   └── auth/
├── shared/
│   ├── api/
│   │   └── service-order.api.ts
│   └── components/
└── router/
```

## 9.3 API Client

**`frontend/src/shared/api/service-order.api.ts`:**

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const serviceOrderApi = {
  create: (data: CreateServiceOrderDto) => api.post("/service-orders", data),

  list: (companyId: string, page: number, limit: number) =>
    api.get("/service-orders", { params: { companyId, page, limit } }),

  getById: (id: string) => api.get(`/service-orders/${id}`),
};
```

## 9.4 Store (Pinia)

**`frontend/src/modules/service-orders/stores/service-order.store.ts`:**

```typescript
import { defineStore } from "pinia";
import { serviceOrderApi } from "@/shared/api/service-order.api";

export const useServiceOrderStore = defineStore("serviceOrder", {
  state: () => ({
    orders: [],
    loading: false,
  }),

  actions: {
    async createOrder(data: CreateServiceOrderDto) {
      this.loading = true;
      try {
        const response = await serviceOrderApi.create(data);
        this.orders.push(response.data);
      } finally {
        this.loading = false;
      }
    },

    async loadOrders(companyId: string) {
      this.loading = true;
      try {
        const response = await serviceOrderApi.list(companyId, 1, 10);
        this.orders = response.data;
      } finally {
        this.loading = false;
      }
    },
  },
});
```

## 9.5 Componente Vue

**`frontend/src/modules/service-orders/components/ServiceOrderForm.vue`:**

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.companyId" placeholder="Company ID" />
    <input v-model="form.description" placeholder="Description" />
    <select v-model="form.priority">
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
    </select>
    <input v-model.number="form.value" type="number" placeholder="Value" />
    <button type="submit" :disabled="loading">Create</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useServiceOrderStore } from "../stores/service-order.store";

const store = useServiceOrderStore();
const form = ref({
  companyId: "",
  description: "",
  priority: "MEDIUM",
  value: 0,
});

const handleSubmit = async () => {
  await store.createOrder(form.value);
};
</script>
```

---

# 🔟 Fase 8: Testes e Qualidade

## 10.1 Testes Unitários

### Domínio

```bash
# Testar Value Objects, Entities, Domain Events
npm run test:unit:domain
```

### Application

```bash
# Testar Use Cases e Queries
npm run test:unit:application
```

## 10.2 Testes de Integração

```typescript
// service-order.integration.spec.ts
describe("ServiceOrder Integration", () => {
  it("should create and retrieve service order", async () => {
    // Teste completo do fluxo
  });
});
```

## 10.3 Testes E2E

```typescript
// service-order.e2e.spec.ts
describe("ServiceOrder E2E", () => {
  it("POST /service-orders", () => {
    // Teste de API completo
  });
});
```

## 10.4 Coverage

```bash
npm run test:coverage
# Meta: > 80% coverage
```

---

# 1️⃣1️⃣ Fase 9: Integração e Deploy

## 11.1 CI/CD Pipeline

**`.github/workflows/ci.yml`:**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
      - run: npm run lint
```

## 11.2 Docker Build

**`backend/Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

## 11.3 Deploy

```bash
# Build
docker-compose -f docker/docker-compose.prod.yml build

# Deploy
docker-compose -f docker/docker-compose.prod.yml up -d
```

---

# 1️⃣2️⃣ Fase 10: Manutenção e Evolução

## 12.1 Monitoramento

- Logs estruturados
- Métricas de performance
- Alertas de erro

## 12.2 Refatoração

- Revisar código periodicamente
- Aplicar princípios SOLID
- Manter testes atualizados

## 12.3 Evolução

- Adicionar novos módulos seguindo o mesmo padrão
- Evoluir para CQRS completo se necessário
- Preparar para microserviços

---

# 📝 Checklist Final

## Antes de Considerar Completo

- [ ] Domínio 100% isolado de framework
- [ ] Todos os testes passando
- [ ] Coverage > 80%
- [ ] Documentação atualizada
- [ ] CI/CD funcionando
- [ ] Deploy em ambiente de staging
- [ ] Code review aprovado
- [ ] ADRs criados para decisões importantes

---

# 🎯 Próximos Passos

1. Revisar este documento periodicamente
2. Adaptar conforme necessário
3. Documentar decisões arquiteturais
4. Manter consistência entre módulos

---

# 🔧 Melhorias do Workflow

Para tornar o workflow completo e produtivo, consulte o documento:

**📄 [`docs/WORKFLOW_IMPROVEMENTS.md`](./docs/WORKFLOW_IMPROVEMENTS.md)**

Este documento lista todas as melhorias práticas que podem ser implementadas:

- ✅ Configurações de desenvolvimento (ESLint, Prettier, EditorConfig)
- ✅ CI/CD e automação (GitHub Actions)
- ✅ Documentação arquitetural (ADRs)
- ✅ Scripts e ferramentas úteis
- ✅ Templates e exemplos
- ✅ Testes e qualidade (Jest, Coverage)
- ✅ Guias práticos (Troubleshooting, Contribuição)
- ✅ Validações e checklists

---

**Última atualização:** 2026
**Versão:** 1.0.0
