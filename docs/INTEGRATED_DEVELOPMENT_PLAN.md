# ServiCore — Plano Integrado de Desenvolvimento

> Documento mestre que integra o plano de telas e funcionalidades com os processos de desenvolvimento, garantindo um sistema sólido e bem arquitetado

**Última atualização:** 2026  
**Versão:** 1.0.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura e Princípios](#arquitetura-e-princípios)
3. [Mapeamento: Funcionalidades → Implementação](#mapeamento-funcionalidades--implementação)
4. [Ordem de Implementação por Módulo](#ordem-de-implementação-por-módulo)
5. [Checklist de Implementação Completo](#checklist-de-implementação-completo)
6. [Validações e Garantias de Qualidade](#validações-e-garantias-de-qualidade)
7. [Referências Cruzadas](#referências-cruzadas)

---

## 🎯 Visão Geral

Este documento integra:

- **Plano de Telas e Funcionalidades** (`SCREEN_AND_FEATURES_PLAN.md`) - O QUE implementar
- **Processo de Desenvolvimento** (`DEVELOPMENT_PROCESS.md`) - COMO implementar
- **Workflow** (`WorkFlow.md`) - ESTRUTURA e ORGANIZAÇÃO
- **Guia Frontend** (`FRONTEND_DEVELOPMENT_GUIDE.md`) - DESENVOLVIMENTO FRONTEND
- **Roadmap** (`IMPLEMENTATION_ROADMAP.md`) - PRIORIZAÇÃO

### Objetivo

Garantir que cada funcionalidade do plano de telas seja implementada seguindo:
- ✅ Arquitetura DDD + Hexagonal + CQRS Light
- ✅ Separação de responsabilidades (Domain, Application, Infrastructure, Presentation)
- ✅ Multi-tenancy consistente
- ✅ Type safety (TypeScript)
- ✅ Testes adequados
- ✅ Documentação atualizada

---

## 🏗️ Arquitetura e Princípios

### Princípios Fundamentais

1. **DDD Estratégico**
   - Bounded Contexts bem definidos
   - Linguagem Ubíqua consistente
   - Aggregates com invariantes claros

2. **Arquitetura Hexagonal**
   - Domínio isolado de frameworks
   - Ports (interfaces) e Adapters (implementações)
   - Testabilidade garantida

3. **CQRS Light**
   - Write Side: Commands → Use Cases → Repository → Aggregate
   - Read Side: Queries → Query Service → DTOs otimizados
   - Separação lógica, não física

4. **Multi-Tenancy**
   - Isolamento por `companyId` em todas as camadas
   - Filtros automáticos no backend
   - Contexto de empresa no frontend

### Estrutura de Camadas (Backend)

```
┌─────────────────────────────────────┐
│   PRESENTATION (Controllers, DTOs)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   APPLICATION (Use Cases, Queries)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   DOMAIN (Aggregates, Entities,    │
│   Value Objects, Events, Repos)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   INFRASTRUCTURE (Prisma, Redis,   │
│   RabbitMQ, External Services)    │
└─────────────────────────────────────┘
```

### Estrutura de Camadas (Frontend)

```
┌─────────────────────────────────────┐
│   PRESENTATION (Views, Components)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   APPLICATION (Stores, Composables) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   DOMAIN (Types, Interfaces)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   INFRASTRUCTURE (API Clients)      │
└─────────────────────────────────────┘
```

---

## 🔄 Mapeamento: Funcionalidades → Implementação

### Template de Mapeamento

Para cada funcionalidade do plano de telas, seguir este mapeamento:

#### 1. Identificar o Módulo (Bounded Context)

- **Identity & Access** → `modules/identity-access/`
- **Organization** → `modules/organization/`
- **Service Order** → `modules/service-order/`
- **Financial** → `modules/financial/`
- **Notifications** → `modules/notifications/` (futuro)
- **Reports** → `modules/reports/` (futuro)

#### 2. Identificar o Tipo de Operação

**Write Side (Commands):**
- Criar, Editar, Deletar
- Ações (start, complete, cancel, approve)
- Mudanças de estado

**Read Side (Queries):**
- Listar, Buscar, Filtrar
- Detalhes, Relatórios
- Dashboards

#### 3. Implementar em Ordem (Backend)

```
1. Domain (Value Objects → Entities → Aggregates → Events → Repository Interface)
2. Application (Use Cases OU Queries)
3. Infrastructure (Repository OU Query Service)
4. Presentation (Controllers + DTOs)
```

#### 4. Implementar em Ordem (Frontend)

```
1. Types (TypeScript interfaces)
2. API Client (métodos de API)
3. Store (Pinia state + actions)
4. Composables (lógica reutilizável)
5. Components (Vue components)
6. Views (páginas completas)
7. Routes (configuração de rotas)
```

---

## 📦 Ordem de Implementação por Módulo

### Módulo 1: Identity & Access

#### Funcionalidades Prioritárias (Fase 1)

| Funcionalidade | Tipo | Backend | Frontend | Prioridade |
|----------------|------|---------|----------|------------|
| Login | Write | ✅ | ✅ | ✅ Alta |
| Registro | Write | ✅ | ✅ | ✅ Alta |
| Recuperação de Senha | Write | ✅ | ✅ | ✅ Alta |
| Gestão de Usuários | CRUD | ❌ | ❌ | 🔴 Alta |
| Gestão de Roles | CRUD | ❌ | ❌ | 🔴 Alta |
| Gestão de Permissões | CRUD | ❌ | ❌ | 🔴 Alta |
| 2FA | Write | ❌ | ❌ | 🟡 Média |
| Verificação de Email | Write | ❌ | ❌ | 🟡 Média |

#### Ordem de Implementação Backend

**Fase 1: Gestão de Usuários**

1. **Domain:**
   - Value Objects: `UserId`, `Email`, `Password` (hashed)
   - Entity: `User` (Aggregate Root)
   - Events: `UserCreatedEvent`, `UserUpdatedEvent`, `UserDeletedEvent`
   - Repository: `UserRepository` (interface)

2. **Application:**
   - Use Cases: `CreateUserUseCase`, `UpdateUserUseCase`, `DeleteUserUseCase`, `ActivateUserUseCase`
   - Queries: `ListUsersQuery`, `GetUserByIdQuery`, `SearchUsersQuery`
   - DTOs: `UserReadDto`, `CreateUserDto`, `UpdateUserDto`

3. **Infrastructure:**
   - `PrismaUserRepository` (implementa `UserRepository`)
   - `PrismaUserQueryService` (implementa queries)
   - `UserMapper` (Domain ↔ Persistence)

4. **Presentation:**
   - `UserController` (Write: POST, PUT, DELETE)
   - `UserQueryController` (Read: GET)
   - DTOs de apresentação

**Fase 2: Gestão de Roles e Permissões**

1. **Domain:**
   - Value Objects: `RoleId`, `PermissionId`, `RoleName`
   - Entities: `Role` (Aggregate Root), `Permission` (Entity)
   - Events: `RoleCreatedEvent`, `PermissionAssignedEvent`
   - Repository: `RoleRepository` (interface)

2. **Application:**
   - Use Cases: `CreateRoleUseCase`, `AssignPermissionToRoleUseCase`
   - Queries: `ListRolesQuery`, `GetRolePermissionsQuery`
   - DTOs: `RoleReadDto`, `PermissionReadDto`

3. **Infrastructure:**
   - `PrismaRoleRepository`
   - `PrismaRoleQueryService`
   - `RoleMapper`

4. **Presentation:**
   - `RoleController`
   - `RoleQueryController`

#### Ordem de Implementação Frontend

**Fase 1: Gestão de Usuários**

1. **Types:**
   ```typescript
   // modules/auth/types/user.types.ts
   export interface User {
     id: string
     email: string
     name: string
     roles: string[]
     permissions: string[]
     active: boolean
   }
   ```

2. **API Client:**
   ```typescript
   // modules/auth/api/user.api.ts
   export const userApi = {
     create: (data: CreateUserDto) => ...,
     update: (id: string, data: UpdateUserDto) => ...,
     delete: (id: string) => ...,
     list: (filters: UserFilters) => ...,
     getById: (id: string) => ...,
   }
   ```

3. **Store:**
   ```typescript
   // modules/auth/stores/user.store.ts
   export const useUserStore = defineStore('user', () => {
     // State, getters, actions
   })
   ```

4. **Components:**
   - `UserForm.vue` (criar/editar)
   - `UserTable.vue` (listagem)
   - `UserFilters.vue` (filtros)

5. **Views:**
   - `UsersView.vue` (lista)
   - `UserCreateView.vue` (criar)
   - `UserDetailsView.vue` (detalhes)

6. **Routes:**
   ```typescript
   {
     path: 'users',
     name: 'Users',
     component: () => import('@/modules/auth/views/UsersView.vue'),
     meta: { requiresPermission: 'user:view' }
   }
   ```

---

### Módulo 2: Organization

#### Funcionalidades Prioritárias (Fase 1)

| Funcionalidade | Tipo | Backend | Frontend | Prioridade |
|----------------|------|---------|----------|------------|
| Gestão de Empresas | CRUD | ✅ | ✅ | ✅ Alta |
| Gestão de Departamentos | CRUD | ❌ | ❌ | 🔴 Alta |
| Configurações da Empresa | Update | ✅ | ✅ | ✅ Alta |
| Seletor de Empresa | Read | ✅ | ✅ | ✅ Alta |

#### Ordem de Implementação

**Backend: Gestão de Departamentos**

1. **Domain:**
   - Value Objects: `DepartmentId`, `DepartmentName`
   - Entity: `Department` (Aggregate Root)
   - Events: `DepartmentCreatedEvent`, `DepartmentUpdatedEvent`
   - Repository: `DepartmentRepository` (interface)

2. **Application:**
   - Use Cases: `CreateDepartmentUseCase`, `UpdateDepartmentUseCase`, `DeleteDepartmentUseCase`
   - Queries: `ListDepartmentsQuery`, `GetDepartmentHierarchyQuery`
   - DTOs: `DepartmentReadDto`, `CreateDepartmentDto`

3. **Infrastructure:**
   - `PrismaDepartmentRepository`
   - `PrismaDepartmentQueryService`
   - `DepartmentMapper`

4. **Presentation:**
   - `DepartmentController`
   - `DepartmentQueryController`

**Frontend: Gestão de Departamentos**

Seguir mesma estrutura de Users (Types → API → Store → Components → Views → Routes)

---

### Módulo 3: Service Order

#### Funcionalidades Prioritárias (Fase 1)

| Funcionalidade | Tipo | Backend | Frontend | Prioridade |
|----------------|------|---------|----------|------------|
| CRUD Básico | CRUD | ✅ | ✅ | ✅ Alta |
| Filtros Avançados | Query | ❌ | ❌ | 🔴 Alta |
| Visualização Kanban | Query | ❌ | ❌ | 🔴 Alta |
| Anexos e Comentários | Write | ❌ | ❌ | 🔴 Alta |
| Templates | CRUD | ❌ | ❌ | 🟡 Média |
| Clientes | CRUD | ❌ | ❌ | 🟡 Média |

#### Ordem de Implementação

**Backend: Filtros Avançados**

1. **Application (Query Side):**
   - Query: `SearchServiceOrdersQuery` (com filtros complexos)
   - DTO: `ServiceOrderSearchFiltersDto`
   - Query Service: Adicionar método `search(filters)` em `PrismaServiceOrderQueryService`

2. **Presentation:**
   - `ServiceOrderQueryController`: Adicionar endpoint `POST /service-orders/search`

**Frontend: Filtros Avançados**

1. **Types:**
   ```typescript
   export interface ServiceOrderFilters {
     status?: string[]
     priority?: string[]
     dateFrom?: string
     dateTo?: string
     responsibleId?: string
     clientId?: string
     minValue?: number
     maxValue?: number
   }
   ```

2. **API Client:**
   ```typescript
   search: (companyId: string, filters: ServiceOrderFilters) => ...
   ```

3. **Store:**
   ```typescript
   async function search(filters: ServiceOrderFilters) {
     // Implementar busca com filtros
   }
   ```

4. **Component:**
   - `ServiceOrderFilters.vue` (já existe, expandir)

5. **View:**
   - Atualizar `ServiceOrdersView.vue` para usar filtros avançados

---

### Módulo 4: Financial

#### Funcionalidades Prioritárias (Fase 1)

| Funcionalidade | Tipo | Backend | Frontend | Prioridade |
|----------------|------|---------|----------|------------|
| Dashboard Financeiro | Query | ❌ | ✅ | 🔴 Alta |
| Transações | CRUD | ❌ | ✅ | 🔴 Alta |
| Contas a Receber | CRUD | ❌ | ❌ | 🔴 Alta |
| Contas a Pagar | CRUD | ❌ | ❌ | 🔴 Alta |
| Faturas | CRUD | ❌ | ❌ | 🔴 Alta |
| Categorias | CRUD | ❌ | ❌ | 🟡 Média |

#### Ordem de Implementação Backend

**Fase 1: Contas a Receber**

1. **Domain:**
   - Value Objects: `ReceivableId`, `DueDate`, `Amount`
   - Entity: `Receivable` (Aggregate Root)
   - Events: `ReceivableCreatedEvent`, `ReceivablePaidEvent`, `ReceivableOverdueEvent`
   - Repository: `ReceivableRepository` (interface)

2. **Application:**
   - Use Cases: `CreateReceivableUseCase`, `ReceivePaymentUseCase`
   - Queries: `ListReceivablesQuery`, `GetOverdueReceivablesQuery`
   - DTOs: `ReceivableReadDto`, `CreateReceivableDto`

3. **Infrastructure:**
   - `PrismaReceivableRepository`
   - `PrismaReceivableQueryService`
   - `ReceivableMapper`

4. **Presentation:**
   - `ReceivableController`
   - `ReceivableQueryController`

**Frontend:** Seguir estrutura padrão

---

## ✅ Checklist de Implementação Completo

### Para Cada Funcionalidade

#### Backend

**Domain:**
- [ ] Value Objects criados e testados
- [ ] Entity/Aggregate criado e testado
- [ ] Domain Events definidos
- [ ] Repository Interface definida
- [ ] Invariantes de domínio implementados
- [ ] Regras de negócio no domínio (não na aplicação)

**Application:**
- [ ] Use Case criado (se Write Side)
- [ ] Query criada (se Read Side)
- [ ] DTOs definidos
- [ ] Testes unitários dos Use Cases/Queries
- [ ] Validações de entrada

**Infrastructure:**
- [ ] Repository implementado (se Write Side)
- [ ] Query Service implementado (se Read Side)
- [ ] Mapper criado (Domain ↔ Persistence)
- [ ] Prisma Schema atualizado
- [ ] Migração criada e executada
- [ ] Testes de integração

**Presentation:**
- [ ] Controller criado
- [ ] DTOs de apresentação criados
- [ ] Validação com class-validator
- [ ] Swagger/OpenAPI documentado
- [ ] Testes E2E

#### Frontend

**Types:**
- [ ] Interfaces TypeScript definidas
- [ ] Alinhadas com DTOs do backend
- [ ] Tipos de request/response

**API Client:**
- [ ] Métodos de API criados
- [ ] Separação Command/Query (se CQRS)
- [ ] Tratamento de erros
- [ ] Tipos corretos

**Store:**
- [ ] State definido
- [ ] Getters (computed) criados
- [ ] Actions (métodos) criados
- [ ] Loading states
- [ ] Error handling

**Composables:**
- [ ] Composables criados (se necessário)
- [ ] Lógica reutilizável extraída

**Components:**
- [ ] Componentes criados
- [ ] Props tipadas
- [ ] Emits tipados
- [ ] Validações de formulário
- [ ] Feedback visual (loading, errors)

**Views:**
- [ ] View criada
- [ ] Integração com Store
- [ ] Integração com Components
- [ ] Roteamento configurado
- [ ] Route guards (se necessário)

**Integração:**
- [ ] Testado com backend real
- [ ] Multi-tenancy funcionando
- [ ] Permissões verificadas
- [ ] Responsividade testada

---

## 🔍 Validações e Garantias de Qualidade

### Validações Arquiteturais

#### Backend

**Domain:**
- ✅ Domínio não importa frameworks (NestJS, Prisma, etc.)
- ✅ Value Objects são imutáveis
- ✅ Aggregates mantêm invariantes
- ✅ Domain Events são publicados corretamente
- ✅ Repository é interface, não implementação

**Application:**
- ✅ Use Cases não acessam Infrastructure diretamente
- ✅ Queries não reconstroem Aggregates
- ✅ DTOs são separados (Read vs Write)
- ✅ Result Pattern usado para erros

**Infrastructure:**
- ✅ Implementa interfaces do Domain/Application
- ✅ Mappers fazem conversão Domain ↔ Persistence
- ✅ Não expõe detalhes de implementação

**Presentation:**
- ✅ Controllers são finos (apenas orquestração)
- ✅ DTOs validados com class-validator
- ✅ Erros tratados adequadamente

#### Frontend

**Types:**
- ✅ Tipos alinhados com backend
- ✅ Sem uso de `any` (usar `unknown` se necessário)

**API Client:**
- ✅ Separação Command/Query (se CQRS)
- ✅ Interceptors configurados
- ✅ Tratamento de erros consistente

**Store:**
- ✅ Estado reativo
- ✅ Actions assíncronas tratadas
- ✅ Loading e error states

**Components:**
- ✅ Props e Emits tipados
- ✅ Validações de formulário
- ✅ Feedback visual

---

## 📚 Referências Cruzadas

### Documentos Relacionados

1. **Plano de Telas e Funcionalidades**
   - Arquivo: `docs/SCREEN_AND_FEATURES_PLAN.md`
   - Uso: Referência do QUE implementar
   - Atualização: Quando novas funcionalidades são identificadas

2. **Processo de Desenvolvimento**
   - Arquivo: `DEVELOPMENT_PROCESS.md`
   - Uso: Referência de COMO implementar (passo a passo)
   - Atualização: Quando processos mudam

3. **Workflow**
   - Arquivo: `WorkFlow.md`
   - Uso: Referência de ESTRUTURA e ORGANIZAÇÃO
   - Atualização: Quando estrutura muda

4. **Guia Frontend**
   - Arquivo: `docs/FRONTEND_DEVELOPMENT_GUIDE.md`
   - Uso: Referência específica para desenvolvimento frontend
   - Atualização: Quando padrões frontend mudam

5. **Roadmap**
   - Arquivo: `docs/IMPLEMENTATION_ROADMAP.md`
   - Uso: Referência de PRIORIZAÇÃO
   - Atualização: Quando prioridades mudam

6. **DDD Estratégico**
   - Arquivo: `docs/DDD_STRATEGIC.md`
   - Uso: Referência de BOUNDED CONTEXTS
   - Atualização: Quando contextos mudam

7. **Linguagem Ubíqua**
   - Arquivo: `docs/UBIQUITOUS_LANGUAGE.md`
   - Uso: Referência de TERMINOLOGIA
   - Atualização: Quando novos termos são adicionados

### Fluxo de Trabalho Recomendado

```
1. Consultar SCREEN_AND_FEATURES_PLAN.md
   ↓
2. Identificar funcionalidade a implementar
   ↓
3. Consultar DDD_STRATEGIC.md para identificar módulo
   ↓
4. Consultar UBIQUITOUS_LANGUAGE.md para terminologia
   ↓
5. Consultar DEVELOPMENT_PROCESS.md para processo
   ↓
6. Consultar WorkFlow.md para estrutura
   ↓
7. Consultar FRONTEND_DEVELOPMENT_GUIDE.md (se frontend)
   ↓
8. Implementar seguindo checklist deste documento
   ↓
9. Validar arquitetura
   ↓
10. Atualizar documentação se necessário
```

---

## 🎯 Próximos Passos Imediatos

### Sprint Atual: Completar Módulos Base

**Backend:**
1. [ ] Implementar gestão completa de Usuários (Domain → Application → Infrastructure → Presentation)
2. [ ] Implementar gestão de Roles e Permissões
3. [ ] Implementar gestão de Departamentos
4. [ ] Expandir Service Order (filtros avançados, anexos, comentários)
5. [ ] Implementar Financial completo (Contas a Receber/Pagar, Faturas)

**Frontend:**
1. [ ] Implementar gestão de Usuários (seguindo checklist)
2. [ ] Implementar gestão de Roles e Permissões
3. [ ] Implementar gestão de Departamentos
4. [ ] Expandir Service Order (filtros avançados, Kanban, anexos)
5. [ ] Completar Financial (Contas a Receber/Pagar, Faturas)

### Validações Antes de Prosseguir

- [ ] Todos os módulos seguem arquitetura definida
- [ ] Multi-tenancy funcionando em todos os módulos
- [ ] Testes unitários > 80% coverage
- [ ] Documentação atualizada
- [ ] Code review aprovado

---

## 📝 Notas de Implementação

### Regras de Ouro

1. **Sempre começar pelo Domain** (Value Objects → Entities → Aggregates)
2. **Nunca pular camadas** (Domain → Application → Infrastructure → Presentation)
3. **Testar cada camada** antes de avançar
4. **Documentar decisões** importantes
5. **Manter consistência** entre módulos

### Quando Duvidar

1. Consultar este documento primeiro
2. Consultar documentos de referência
3. Seguir padrões já estabelecidos
4. Documentar decisões não padronizadas

---

**Última atualização:** 2026  
**Versão:** 1.0.0  
**Mantenedor:** Equipe ServiCore

