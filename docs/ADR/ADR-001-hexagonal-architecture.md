# ADR-001: Hexagonal Architecture (Ports and Adapters)

## Status
Aceito

## Contexto
O ServiCore precisa de uma arquitetura que permita:
- Isolamento do domínio de negócio de frameworks e tecnologias externas
- Facilidade para testar o código de domínio sem dependências externas
- Flexibilidade para trocar implementações de infraestrutura (banco de dados, mensageria, etc.)
- Manutenibilidade e clareza na separação de responsabilidades

## Decisão
Adotamos a Arquitetura Hexagonal (Ports and Adapters) como padrão arquitetural principal do projeto.

### Princípios Aplicados

1. **Domínio no Centro**
   - O domínio (entities, value objects, domain events) não possui dependências externas
   - Regras de negócio são implementadas puramente em TypeScript, sem frameworks

2. **Ports (Interfaces)**
   - Interfaces definem contratos que o domínio espera
   - Exemplo: `ServiceOrderRepository` define como persistir ordens de serviço
   - Exemplo: `ServiceOrderQueryService` define como consultar dados

3. **Adapters (Implementações)**
   - Implementações concretas ficam na camada de infraestrutura
   - Exemplo: `PrismaServiceOrderRepository` implementa `ServiceOrderRepository` usando Prisma
   - Exemplo: `PrismaServiceOrderQueryService` implementa consultas usando Prisma

4. **Camadas**
   ```
   Presentation (Controllers, DTOs)
        ↓
   Application (Use Cases, Queries)
        ↓
   Domain (Entities, Value Objects, Events, Repository Interfaces)
        ↑
   Infrastructure (Repository Implementations, Database, External Services)
   ```

## Consequências

### Positivas
- ✅ Domínio isolado e testável sem mocks complexos
- ✅ Facilidade para trocar implementações (ex: Prisma → TypeORM)
- ✅ Código de domínio mais limpo e focado em regras de negócio
- ✅ Testes unitários do domínio são rápidos e não dependem de infraestrutura

### Negativas
- ⚠️ Mais camadas e abstrações podem parecer complexas inicialmente
- ⚠️ Requer disciplina da equipe para não "vazar" dependências para o domínio
- ⚠️ Mappers são necessários para converter entre domínio e persistência

## Implementação

### Estrutura de Pastas
```
backend/src/
├── shared/              # Base compartilhada
│   ├── domain/         # BaseEntity, AggregateRoot, ValueObject, DomainEvent
│   ├── application/    # Result Pattern, Base Use Case, Base Query
│   └── infrastructure/ # PrismaService
└── modules/
    └── service-order/
        ├── domain/              # Camada de Domínio
        │   ├── entities/
        │   ├── value-objects/
        │   ├── events/
        │   └── repositories/    # Interfaces (Ports)
        ├── application/         # Camada de Aplicação
        │   ├── use-cases/       # Write Side
        │   └── queries/         # Read Side
        ├── infrastructure/      # Camada de Infraestrutura
        │   ├── persistence/     # Implementações (Adapters)
        │   └── mappers/         # Domain ↔ Persistence
        └── presentation/        # Camada de Apresentação
            ├── controllers/
            └── dtos/
```

### Regras de Dependência
- ✅ Domínio pode depender apenas de `@shared/domain`
- ✅ Application pode depender de Domain e `@shared/application`
- ✅ Infrastructure pode depender de Domain, Application e `@shared/infrastructure`
- ✅ Presentation pode depender de Application, Domain e Infrastructure
- ❌ Domínio NÃO pode depender de Application, Infrastructure ou Presentation
- ❌ Application NÃO pode depender de Infrastructure ou Presentation

## Referências
- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## Histórico
- 2026-02-17: Decisão inicial documentada

