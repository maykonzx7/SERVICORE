# Camada de Aplicação - Base Compartilhada

> Classes base e utilitários para a camada de aplicação (Use Cases e Queries)

## 📋 Estrutura

```
shared/application/
├── base-use-case.ts          # Classe base para Use Cases (Write Side)
├── base-query.ts             # Classe base para Queries (Read Side)
├── result.ts                 # Result Pattern
├── interfaces/               # Interfaces base
│   ├── use-case.interface.ts
│   └── query.interface.ts
└── dto/                      # DTOs compartilhados
    ├── pagination.dto.ts
    └── paginated-result.dto.ts
```

---

## 🎯 Use Cases (Write Side)

### BaseUseCase

Classe base abstrata para todos os Use Cases. Fornece:
- Integração com Result Pattern
- Métodos auxiliares `success()` e `failure()`
- Contrato padronizado via interface `IUseCase`

### Exemplo de Uso

```typescript
import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { ServiceOrderRepository } from "../../domain/repositories/service-order.repository";
import { ServiceOrder } from "../../domain/entities/service-order";

interface CreateServiceOrderInput {
  companyId: string;
  description: string;
  priority: string;
  value: number;
}

@Injectable()
export class CreateServiceOrderUseCase extends BaseUseCase<
  CreateServiceOrderInput,
  ServiceOrder
> {
  constructor(private readonly repository: ServiceOrderRepository) {
    super();
  }

  async execute(input: CreateServiceOrderInput): Promise<Result<ServiceOrder>> {
    try {
      // Validações e lógica de negócio
      const serviceOrder = ServiceOrder.create(/* ... */);
      
      await this.repository.save(serviceOrder);
      
      return this.success(serviceOrder);
    } catch (error) {
      return this.failure(error.message);
    }
  }
}
```

---

## 📖 Queries (Read Side)

### BaseQuery

Classe base abstrata para todas as Queries. Fornece:
- Contrato padronizado via interface `IQuery`
- Estrutura simples para consultas

### Exemplo de Uso

```typescript
import { Injectable } from "@nestjs/common";
import { BaseQuery } from "@shared/application/base-query";
import { ServiceOrderReadDto } from "./dto/service-order-read.dto";
import { ServiceOrderQueryServiceInterface } from "./service-order-query.service.interface";

interface ListServiceOrdersInput {
  companyId: string;
  page: number;
  limit: number;
}

@Injectable()
export class ListServiceOrdersQuery extends BaseQuery<
  ListServiceOrdersInput,
  ServiceOrderReadDto[]
> {
  constructor(
    private readonly queryService: ServiceOrderQueryServiceInterface
  ) {
    super();
  }

  async execute(
    input: ListServiceOrdersInput
  ): Promise<ServiceOrderReadDto[]> {
    return this.queryService.findByCompanyId(
      input.companyId,
      input.page,
      input.limit
    );
  }
}
```

---

## 📄 DTOs Compartilhados

### PaginationDto

DTO para informações de paginação:

```typescript
import { PaginationDto } from "@shared/application/dto";

const pagination = new PaginationDto(1, 10);
// pagination.page = 1
// pagination.limit = 10
// pagination.offset = 0 (calculado automaticamente)
```

### PaginatedResultDto

DTO para resultados paginados:

```typescript
import { PaginatedResultDto, PaginationDto } from "@shared/application/dto";

const pagination = new PaginationDto(1, 10);
pagination.total = 100; // Total de itens

const result = new PaginatedResultDto(data, pagination);
// result.data = [...]
// result.pagination = { page, limit, total, totalPages }
```

---

## ✅ Result Pattern

Use o Result Pattern para operações que podem falhar:

```typescript
import { Result } from "@shared/application/result";

// Sucesso
const success = Result.ok(value);

// Falha
const failure = Result.fail("Mensagem de erro");

// Verificar resultado
if (result.isSuccess) {
  const value = result.value;
} else {
  const error = result.error;
}

// Encadeamento
result
  .onSuccess((value) => console.log("Sucesso:", value))
  .onFailure((error) => console.error("Erro:", error));

// Transformação
const mapped = result.map((value) => value * 2);
```

---

## 🎯 Boas Práticas

### Use Cases

1. **Sempre use Result Pattern** para retornar sucesso ou falha
2. **Valide inputs** antes de processar
3. **Use métodos auxiliares** `success()` e `failure()`
4. **Não acesse infraestrutura diretamente** - use repositories
5. **Mantenha lógica de negócio** no domínio, não no Use Case

### Queries

1. **Retorne DTOs**, não entidades de domínio
2. **Use interfaces** para Query Services (não implementações)
3. **Implemente paginação** quando apropriado
4. **Otimize consultas** para leitura (sem regras de negócio complexas)

---

## 📚 Referências

- **DEVELOPMENT_PROCESS.md** - Fase 4: Desenvolvimento da Camada de Aplicação
- **WorkFlow.md** - Separação Write/Read (CQRS)


