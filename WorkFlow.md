# ServiCore — Development Workflow & Repository Structure (DDD + Hexagonal + CQRS Leve)

> Arquitetura Oficial do TCC:
>
> - DDD Estratégico + Tático
> - Arquitetura Hexagonal (Ports & Adapters)
> - CQRS Leve (Write Model + Read Model separados logicamente)
> - Multi-tenant
> - NestJS + Vue 3 + PostgreSQL + Redis + RabbitMQ

Este documento substitui a versão anterior e formaliza a estrutura correta do repositório considerando:

- Repository por Aggregate Root (Write Side)
- Query Service separado (Read Side)
- Domínio 100% isolado de framework
- Infraestrutura apenas como Adapter

---

# 1️⃣ Estrutura Oficial do Repositório

```
servicore/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DDD_STRATEGIC.md
│   ├── UBIQUITOUS_LANGUAGE.md
│   ├── CQRS_DECISION.md
│   └── ADR/
│       ├── 001-hexagonal-architecture.md
│       └── 002-cqrs-light.md
│
├── docker/
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       │
│       ├── shared/
│       │   ├── domain/
│       │   │   ├── base-entity.ts
│       │   │   ├── aggregate-root.ts
│       │   │   └── value-object.ts
│       │   │
│       │   ├── application/
│       │   │   ├── result.ts
│       │   │   └── interfaces/
│       │   │
│       │   └── infrastructure/
│       │       ├── prisma.service.ts
│       │       ├── redis.service.ts
│       │       └── logger.service.ts
│       │
│       ├── modules/
│       │
│       │   ├── identity-access/
│       │   │   ├── domain/
│       │   │   ├── application/
│       │   │   │   ├── use-cases/
│       │   │   │   └── queries/
│       │   │   ├── infrastructure/
│       │   │   └── presentation/
│       │   │
│       │   ├── organization/
│       │   │   ├── domain/
│       │   │   ├── application/
│       │   │   ├── infrastructure/
│       │   │   └── presentation/
│       │   │
│       │   ├── service-order/
│       │   │   ├── domain/
│       │   │   │   ├── entities/
│       │   │   │   │   └── service-order.ts
│       │   │   │   ├── value-objects/
│       │   │   │   │   ├── service-order-id.ts
│       │   │   │   │   ├── company-id.ts
│       │   │   │   │   ├── priority.ts
│       │   │   │   │   └── money.ts
│       │   │   │   ├── events/
│       │   │   │   │   └── service-order-created.event.ts
│       │   │   │   └── repositories/
│       │   │   │       └── service-order.repository.ts
│       │   │   │
│       │   │   ├── application/
│       │   │   │   ├── use-cases/        # WRITE SIDE
│       │   │   │   │   ├── create-service-order.usecase.ts
│       │   │   │   │   ├── start-service-order.usecase.ts
│       │   │   │   │   └── finish-service-order.usecase.ts
│       │   │   │   │
│       │   │   │   ├── queries/          # READ SIDE
│       │   │   │   │   ├── list-service-orders.query.ts
│       │   │   │   │   ├── get-service-order-details.query.ts
│       │   │   │   │   └── dto/
│       │   │   │   │       └── service-order-read.dto.ts
│       │   │   │   │
│       │   │   │   └── mappers/
│       │   │   │
│       │   │   ├── infrastructure/
│       │   │   │   ├── persistence/
│       │   │   │   │   ├── prisma-service-order.repository.ts
│       │   │   │   │   └── prisma-service-order.query.service.ts
│       │   │   │   ├── messaging/
│       │   │   │   └── cache/
│       │   │   │
│       │   │   └── presentation/
│       │   │       ├── controllers/
│       │   │       └── dtos/
│       │   │
│       │   └── financial/
│       │       ├── domain/
│       │       ├── application/
│       │       ├── infrastructure/
│       │       └── presentation/
│       │
│       └── config/
│           ├── database.config.ts
│           ├── redis.config.ts
│           └── rabbitmq.config.ts
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   │
│   └── src/
│       ├── main.ts
│       ├── router/
│       ├── stores/
│       ├── shared/
│       │   ├── api/
│       │   ├── components/
│       │   └── layouts/
│       │
│       └── modules/
│           ├── auth/
│           ├── dashboard/
│           ├── service-orders/
│           └── financial/
│
├── .env.example
├── README.md
├── CONTRIBUTING.md
└── SPRINTS.md
```

---

# 2️⃣ Organização CQRS Leve (Oficial)

## WRITE SIDE (DDD Puro)

Local:

```
service-order/domain/
service-order/application/use-cases/
```

Regras:

- Usa Aggregate Root
- Usa Repository Interface
- Aplica regra de negócio
- Nunca acessa Prisma diretamente

Fluxo:

Controller → UseCase → Repository (interface) → Infra (Prisma)

---

## READ SIDE (Query Service)

Local:

```
service-order/application/queries/
service-order/infrastructure/persistence/prisma-service-order.query.service.ts
```

Regras:

- NÃO usa Aggregate
- NÃO aplica regra de negócio
- NÃO reconstrói entidade de domínio
- Retorna DTO otimizado

Fluxo:

Controller → Query → QueryService → Prisma → DTO

---

# 3️⃣ Regras Arquiteturais Obrigatórias

✔ Domínio não importa NestJS
✔ Domínio não importa Prisma
✔ Domínio não conhece banco
✔ Repository manipula apenas Aggregate
✔ Query Service manipula apenas leitura
✔ Controller nunca acessa ORM diretamente

---

# 4️⃣ Como Explicar Isso no TCC

Você poderá afirmar que:

- A escrita foi modelada com consistência forte via Aggregate Root.
- A leitura foi desacoplada para otimização de consultas.
- O sistema utiliza CQRS leve, permitindo futura evolução para CQRS completo.
- A arquitetura é orientada a domínio e preparada para microserviços.

---

# 5️⃣ Separação do Desenvolvimento

## 5.1 Separação por Camadas (Vertical)

Cada desenvolvedor pode trabalhar em uma camada completa de um módulo:

### Fase 1: Domínio (Base)

**Responsável:** Domain Expert / Backend Senior

**Arquivos:**

```
modules/{module}/domain/
├── entities/
├── value-objects/
├── events/
└── repositories/ (interfaces)
```

**Regras:**

- ✅ Zero dependências externas
- ✅ Testável sem framework
- ✅ Pode ser desenvolvido em paralelo por módulo
- ✅ Deve ser finalizado antes das outras camadas

**Ordem de Implementação:**

1. Value Objects (mais básicos)
2. Entities
3. Aggregate Root
4. Domain Events
5. Repository Interfaces

---

### Fase 2: Application - Write Side

**Responsável:** Backend Developer (Write)

**Arquivos:**

```
modules/{module}/application/use-cases/
```

**Dependências:**

- ✅ Domínio completo do módulo
- ✅ Repository Interface definida
- ❌ NÃO depende de Infrastructure

**Regras:**

- Implementa lógica de negócio de aplicação
- Orquestra chamadas ao Repository
- Pode ser testado com mocks do Repository
- Desenvolvido após o Domínio

---

### Fase 3: Application - Read Side

**Responsável:** Backend Developer (Read)

**Arquivos:**

```
modules/{module}/application/queries/
└── dto/
```

**Dependências:**

- ✅ Domínio (apenas para tipos, não para reconstruir)
- ❌ NÃO depende de Write Side
- ❌ NÃO depende de Infrastructure

**Regras:**

- Pode ser desenvolvido em paralelo com Write Side
- Define DTOs otimizados para leitura
- Não aplica regras de negócio complexas

---

### Fase 4: Infrastructure

**Responsável:** Backend Developer (Infra)

**Arquivos:**

```
modules/{module}/infrastructure/
├── persistence/
│   ├── prisma-{module}.repository.ts
│   └── prisma-{module}.query.service.ts
├── messaging/
└── cache/
```

**Dependências:**

- ✅ Domínio completo
- ✅ Application (Use Cases + Queries)
- ✅ Prisma Schema

**Regras:**

- Implementa adapters concretos
- Pode ser desenvolvido em paralelo por tipo (persistence, messaging, cache)
- Última camada a ser implementada

---

### Fase 5: Presentation

**Responsável:** Backend Developer (API) ou Full Stack

**Arquivos:**

```
modules/{module}/presentation/
├── controllers/
└── dtos/
```

**Dependências:**

- ✅ Application completa (Use Cases + Queries)
- ✅ Infrastructure completa

**Regras:**

- Última camada a ser implementada
- Pode ser desenvolvida em paralelo com Frontend (usando contrato de API)

---

## 5.2 Separação por Módulos (Horizontal)

Cada módulo pode ser desenvolvido de forma independente após a base compartilhada:

### Ordem de Dependência dos Módulos

```
1. shared/ (base)
   ↓
2. identity-access/ (autenticação/autorização)
   ↓
3. organization/ (multi-tenant)
   ↓
4. service-order/ (depende de organization)
   ↓
5. financial/ (depende de service-order)
```

### Desenvolvimento Paralelo

**Pode ser paralelo:**

- `service-order` e `financial` (após organization estar pronto)
- Write Side e Read Side do mesmo módulo
- Infrastructure de diferentes tipos (persistence, messaging, cache)

**NÃO pode ser paralelo:**

- Application antes do Domain
- Infrastructure antes do Application
- Presentation antes do Application

---

## 5.3 Separação por Write/Read (CQRS)

### Write Side (Comando)

**Time:** Backend Team A

**Fluxo de Desenvolvimento:**

1. Domain Model (Aggregate)
2. Use Cases
3. Repository Interface
4. Repository Implementation (Prisma)
5. Controller (Write endpoints)

**Características:**

- Foco em consistência
- Transações
- Validações de negócio
- Eventos de domínio

---

### Read Side (Query)

**Time:** Backend Team B

**Fluxo de Desenvolvimento:**

1. DTOs de leitura
2. Query Handlers
3. Query Service (Prisma direto)
4. Controller (Read endpoints)
5. Cache Strategy

**Características:**

- Foco em performance
- Sem transações complexas
- Otimizações de consulta
- Cache quando necessário

**Pode ser desenvolvido em paralelo com Write Side!**

---

## 5.4 Separação por Equipes/Desenvolvedores

### Time 1: Domain Team

**Responsabilidades:**

- Modelagem de domínio
- Value Objects
- Entities e Aggregates
- Domain Events
- Repository Interfaces

**Pode trabalhar em:**

- Múltiplos módulos em paralelo (após shared/)
- Zero dependência de infraestrutura

---

### Time 2: Write Team

**Responsabilidades:**

- Use Cases (Write)
- Validações de aplicação
- Orquestração de comandos
- Testes de integração (Write)

**Depende de:**

- Domain Team entregar interfaces

---

### Time 3: Read Team

**Responsabilidades:**

- Query Handlers
- Query Services
- DTOs de leitura
- Otimizações e cache

**Pode trabalhar em paralelo com:**

- Write Team (após Domain estar pronto)

---

### Time 4: Infrastructure Team

**Responsabilidades:**

- Implementações Prisma
- Integrações externas
- Mensageria
- Cache

**Depende de:**

- Domain (interfaces)
- Application (contratos)

---

### Time 5: API Team

**Responsabilidades:**

- Controllers
- DTOs de apresentação
- Validações de entrada
- Documentação (Swagger)

**Depende de:**

- Application completa

---

### Time 6: Frontend Team

**Responsabilidades:**

- Consumo de APIs
- UI/UX
- Estado da aplicação
- Integração com backend

**Pode começar após:**

- Contratos de API definidos (pode usar mocks)

---

## 5.5 Estratégia de Branching por Separação

### Opção 1: Branch por Camada

```
feature/domain-service-order
feature/application-write-service-order
feature/application-read-service-order
feature/infrastructure-service-order
feature/presentation-service-order
```

### Opção 2: Branch por Módulo Completo

```
feature/service-order-write
feature/service-order-read
feature/service-order-infra
```

### Opção 3: Branch por Responsabilidade

```
feature/service-order-domain
feature/service-order-commands
feature/service-order-queries
```

**Recomendação:** Opção 3 (mais granular, permite merge incremental)

---

## 5.6 Checklist de Dependências

Antes de começar uma camada, verificar:

### Para Application (Write):

- [ ] Domain Entities criadas
- [ ] Value Objects implementados
- [ ] Repository Interface definida
- [ ] Domain Events definidos (se necessário)

### Para Application (Read):

- [ ] Domain Value Objects (para tipos)
- [ ] Prisma Schema atualizado
- [ ] DTOs de leitura definidos

### Para Infrastructure:

- [ ] Domain completo
- [ ] Application Use Cases/Queries criados
- [ ] Prisma Schema atualizado
- [ ] Interfaces de Repository/Query definidas

### Para Presentation:

- [ ] Application completa
- [ ] Infrastructure implementada
- [ ] Contratos de API definidos

---

## 5.7 Workflow de Desenvolvimento para Agentes

### Agente 1 — Arquiteto

- Manter docs/ atualizados
- Criar ADRs
- Garantir isolamento do domínio
- Definir contratos entre camadas
- Revisar modelagem de domínio

### Agente 2 — Backend (Write)

- Implementar Aggregates
- Implementar Use Cases
- Criar testes unitários
- Validar regras de negócio

### Agente 3 — Backend (Read)

- Criar Query Services
- Otimizar consultas
- Implementar paginação e filtros
- Configurar cache

### Agente 4 — Frontend

- Consumir apenas endpoints
- Nunca aplicar regra de negócio crítica
- Trabalhar com contratos de API
- Implementar UI/UX

### Agente 5 — DevOps

- Manter CI
- Garantir coverage
- Configurar ambientes
- Gerenciar dependências entre branches

---

## 5.8 Exemplo Prático: Desenvolvimento do Módulo Service-Order

### Cenário: 3 Desenvolvedores Trabalhando em Paralelo

**Desenvolvedor A (Domain Expert):**

```
Semana 1-2:
├── service-order-id.ts (Value Object)
├── company-id.ts (Value Object)
├── priority.ts (Value Object)
├── money.ts (Value Object)
└── service-order.ts (Aggregate Root)

Semana 3:
├── service-order-created.event.ts
├── service-order-started.event.ts
└── service-order.repository.ts (interface)
```

**Desenvolvedor B (Write Side):**

```
Semana 2-3 (após Value Objects):
├── create-service-order.usecase.ts
└── start-service-order.usecase.ts

Semana 4 (após Aggregate completo):
├── finish-service-order.usecase.ts
└── cancel-service-order.usecase.ts
```

**Desenvolvedor C (Read Side):**

```
Semana 2-3 (em paralelo com Write):
├── service-order-read.dto.ts
├── list-service-orders.query.ts
└── get-service-order-details.query.ts

Semana 4:
├── search-service-orders.query.ts
└── get-service-order-statistics.query.ts
```

**Desenvolvedor D (Infrastructure):**

```
Semana 4-5 (após Application completa):
├── prisma-service-order.repository.ts
└── prisma-service-order.query.service.ts
```

**Desenvolvedor E (API):**

```
Semana 5-6 (após Infrastructure):
├── service-order.controller.ts
└── service-order.dto.ts (presentation)
```

---

## 5.9 Diagrama de Fluxo de Desenvolvimento

```
┌─────────────────────────────────────────────────────────────┐
│                    FASE 0: BASE SHARED                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Base Entity  │  │ Aggregate    │  │ Value Object│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              FASE 1: DOMAIN (Por Módulo)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ identity-    │  │ organization │  │ service-     │      │
│  │ access       │  │              │  │ order        │      │
│  │ (domain)     │  │ (domain)     │  │ (domain)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                ↓                    ↓             │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────────┐          ┌──────────────────────┐
│   FASE 2A: WRITE     │          │   FASE 2B: READ      │
│  ┌────────────────┐  │          │  ┌────────────────┐  │
│  │ Use Cases      │  │          │  │ Queries        │  │
│  │ (Commands)     │  │          │  │ (Read)         │  │
│  └────────────────┘  │          │  └────────────────┘  │
│         ↓            │          │         ↓            │
└──────────────────────┘          └──────────────────────┘
        ↓                                       ↓
        └───────────────────┬───────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              FASE 3: INFRASTRUCTURE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Persistence   │  │ Messaging    │  │ Cache        │      │
│  │ (Prisma)      │  │ (RabbitMQ)   │  │ (Redis)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              FASE 4: PRESENTATION                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers   │  │ DTOs         │  │ Validators   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              FASE 5: FRONTEND                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Client   │  │ Components   │  │ Stores       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

**Legenda:**

- `↓` = Dependência (deve aguardar)
- `→` = Pode ser paralelo
- Fases marcadas podem ser desenvolvidas simultaneamente por diferentes times

---

## 5.10 Regras de Ouro para Separação

### ✅ PODE fazer em paralelo:

1. **Módulos diferentes** (após shared/ e dependências resolvidas)
2. **Write Side e Read Side** do mesmo módulo (após Domain)
3. **Infrastructure de tipos diferentes** (persistence, messaging, cache)
4. **Frontend e Backend** (usando contratos de API)

### ❌ NÃO PODE fazer em paralelo:

1. **Application antes do Domain**
2. **Infrastructure antes do Application**
3. **Presentation antes do Application**
4. **Módulo dependente antes do módulo base**

### 🔄 Pode começar quando:

- **Domain:** Imediatamente após shared/
- **Write Side:** Após Domain completo do módulo
- **Read Side:** Após Value Objects (não precisa esperar Aggregate completo)
- **Infrastructure:** Após Application completa
- **Presentation:** Após Infrastructure completa
- **Frontend:** Após contratos de API definidos

---

# 6️⃣ Roadmap Atualizado

Sprint 1 — Setup Base
Sprint 2 — Modelagem Completa do Domínio
Sprint 3 — Implementação Write Side
Sprint 4 — Implementação Read Side
Sprint 5 — Frontend MVP
Sprint 6 — Eventos + Mensageria
Sprint 7 — Dashboard + KPIs
Sprint 8 — Hardening + Deploy

> **📘 Guia Frontend:** Para detalhes sobre desenvolvimento frontend integrado, consulte [`docs/FRONTEND_DEVELOPMENT_GUIDE.md`](./docs/FRONTEND_DEVELOPMENT_GUIDE.md)

---

# Status Arquitetural Atual

Arquitetura: Hexagonal ✔
DDD Estratégico ✔
DDD Tático ✔
CQRS Leve ✔
Multi-Tenant ✔
Preparado para evolução ✔

---

Se quiser, posso agora:

1️⃣ Gerar o módulo `service-order` completo com todos os arquivos reais
2️⃣ Gerar testes unitários do domínio
3️⃣ Gerar os ADRs formais para documentação do TCC
4️⃣ Criar um diagrama arquitetural explicativo para incluir no documento acadêmico

Qual avançamos agora?
