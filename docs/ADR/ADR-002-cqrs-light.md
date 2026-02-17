# ADR-002: CQRS Light (Command Query Responsibility Segregation)

## Status
Aceito

## Contexto
O ServiCore precisa lidar com operações de escrita (commands) e leitura (queries) que têm características diferentes:
- **Commands**: Modificam estado, precisam de validação de regras de negócio, podem gerar eventos
- **Queries**: Apenas leem dados, podem precisar de otimizações específicas, podem agregar dados de múltiplas fontes

Separar essas responsabilidades permite:
- Otimizar leituras independentemente de escritas
- Escalar leitura e escrita separadamente
- Simplificar modelos de domínio focados em regras de negócio

## Decisão
Adotamos uma abordagem **CQRS Light** (não CQRS completo com event sourcing):

### Características

1. **Separação de Write e Read Side**
   - **Write Side**: Use Cases que modificam estado através de Aggregates
   - **Read Side**: Queries que retornam DTOs otimizados para leitura

2. **Modelos Separados**
   - **Write Model**: Aggregates do domínio (ex: `ServiceOrder`)
   - **Read Model**: DTOs de leitura (ex: `ServiceOrderReadDto`)

3. **Repositórios Separados**
   - **Write Repository**: `ServiceOrderRepository` - trabalha com Aggregates
   - **Read Repository (Query Service)**: `ServiceOrderQueryService` - trabalha com DTOs

4. **Sem Event Sourcing**
   - Não armazenamos eventos como fonte de verdade
   - Eventos de domínio são publicados, mas não são a única forma de reconstruir estado
   - Estado é persistido diretamente no banco de dados

### Implementação

#### Write Side
```typescript
// Use Case (Command)
class CreateServiceOrderUseCase {
  async execute(input): Promise<Result<ServiceOrder>> {
    const order = ServiceOrder.create(...); // Aggregate
    await this.repository.save(order);     // Persiste Aggregate
    return Result.ok(order);
  }
}
```

#### Read Side
```typescript
// Query
class ListServiceOrdersQuery {
  async execute(companyId: string): Promise<ServiceOrderReadDto[]> {
    return this.queryService.findByCompanyId(companyId); // Retorna DTOs
  }
}
```

#### Controllers Separados
```typescript
// Write Controller
@Controller("service-orders")
class ServiceOrderController {
  @Post()
  async create(@Body() dto: CreateServiceOrderDto) {
    // Usa Use Cases
  }
}

// Read Controller
@Controller("service-orders")
class ServiceOrderQueryController {
  @Get()
  async list(@Query() params) {
    // Usa Queries
  }
}
```

## Consequências

### Positivas
- ✅ Modelos de leitura otimizados para performance
- ✅ Write model focado em regras de negócio
- ✅ Facilita futura evolução para CQRS completo se necessário
- ✅ Queries podem agregar dados de múltiplas fontes sem afetar write model

### Negativas
- ⚠️ Duplicação entre Write e Read models
- ⚠️ Sincronização entre modelos (resolvido com mesma fonte de dados - Prisma)
- ⚠️ Mais código para manter (controllers, queries, DTOs separados)

## Quando Evoluir para CQRS Completo?

Considerar evolução para CQRS completo com Event Sourcing quando:
- Necessidade de histórico completo de mudanças
- Necessidade de múltiplas projeções de leitura
- Necessidade de auditoria detalhada
- Necessidade de time travel (replay de eventos)

## Referências
- [CQRS Pattern - Martin Fowler](https://martinfowler.com/bliki/CQRS.html)
- [CQRS Journey - Microsoft](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/jj554200(v=pandp.10))

## Histórico
- 2026-02-17: Decisão inicial documentada

