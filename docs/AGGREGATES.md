# ServiCore — Identificação de Aggregates

> Mapeamento detalhado dos Aggregates, Entities, Value Objects e Domain Events de cada Bounded Context

**Última atualização:** 2024  
**Versão:** 1.0.0

---

## 📋 Índice

1. [Identity & Access](#identity--access)
2. [Organization](#organization)
3. [Service Order](#service-order)
4. [Financial](#financial)

---

## 🔐 Identity & Access

### Aggregate Root: User

**Responsabilidade:** Representa um usuário do sistema com suas credenciais, roles e sessões.

**Boundaries:**
- Contém informações de autenticação
- Gerencia roles do usuário
- Controla sessões ativas

**Entities:**
- `User` (Aggregate Root)
- `Session` (Entity dentro do Aggregate User)

**Value Objects:**
- `UserId`
- `Email`
- `Password` (hasheado, nunca exposto)
- `Role`
- `Permission`
- `SessionId`
- `Token`

**Domain Events:**
- `UserCreatedEvent`
- `UserEmailChangedEvent`
- `UserPasswordChangedEvent`
- `UserRoleAssignedEvent`
- `UserRoleRemovedEvent`
- `UserActivatedEvent`
- `UserDeactivatedEvent`
- `UserAuthenticatedEvent`
- `SessionCreatedEvent`
- `SessionExpiredEvent`
- `SessionTerminatedEvent`

**Repository Interface:**
- `UserRepository`
  - `save(user: User): Promise<void>`
  - `findById(id: UserId): Promise<User | null>`
  - `findByEmail(email: Email): Promise<User | null>`
  - `findByRole(role: Role): Promise<User[]>`
  - `delete(id: UserId): Promise<void>`

**Regras de Invariantes:**
- Email deve ser único
- Senha deve seguir política de segurança
- Usuário deve ter pelo menos um role
- Sessões expiram após período de inatividade

---

### Aggregate Root: Role (Opcional - se roles forem gerenciáveis)

**Responsabilidade:** Define um conjunto de permissões que pode ser atribuído a usuários.

**Nota:** Se roles forem fixos no sistema, este aggregate pode não ser necessário.

**Entities:**
- `Role` (Aggregate Root)

**Value Objects:**
- `RoleId`
- `RoleName`
- `Permission`

**Domain Events:**
- `RoleCreatedEvent`
- `RoleUpdatedEvent`
- `PermissionAddedToRoleEvent`
- `PermissionRemovedFromRoleEvent`

**Repository Interface:**
- `RoleRepository`
  - `save(role: Role): Promise<void>`
  - `findById(id: RoleId): Promise<Role | null>`
  - `findByName(name: RoleName): Promise<Role | null>`
  - `findAll(): Promise<Role[]>`

---

## 🏢 Organization

### Aggregate Root: Company

**Responsabilidade:** Representa uma empresa (tenant) no sistema multi-tenant.

**Boundaries:**
- Contém informações da empresa
- Gerencia departamentos
- Controla configurações organizacionais

**Entities:**
- `Company` (Aggregate Root)
- `Department` (Entity dentro do Aggregate Company)

**Value Objects:**
- `CompanyId`
- `CNPJ`
- `CompanyName`
- `Address`
- `Phone`
- `Email`
- `DepartmentId`
- `DepartmentName`

**Domain Events:**
- `CompanyCreatedEvent`
- `CompanyUpdatedEvent`
- `CompanyActivatedEvent`
- `CompanyDeactivatedEvent`
- `DepartmentCreatedEvent`
- `DepartmentUpdatedEvent`
- `DepartmentDeletedEvent`
- `UserAssignedToCompanyEvent`
- `UserRemovedFromCompanyEvent`

**Repository Interface:**
- `CompanyRepository`
  - `save(company: Company): Promise<void>`
  - `findById(id: CompanyId): Promise<Company | null>`
  - `findByCNPJ(cnpj: CNPJ): Promise<Company | null>`
  - `findAll(): Promise<Company[]>`
  - `delete(id: CompanyId): Promise<void>`

**Regras de Invariantes:**
- CNPJ deve ser único
- Empresa deve ter nome válido
- Departamento deve pertencer a uma empresa
- Empresa deve ter pelo menos um usuário associado

---

### Aggregate Root: OrganizationSettings

**Responsabilidade:** Configurações específicas de uma empresa.

**Nota:** Pode ser parte do Aggregate Company ou separado, dependendo da complexidade.

**Entities:**
- `OrganizationSettings` (Aggregate Root)

**Value Objects:**
- `CompanyId` (referência)
- `Currency`
- `Timezone`
- `DateFormat`
- `TimeFormat`
- `Locale`

**Domain Events:**
- `OrganizationSettingsUpdatedEvent`

**Repository Interface:**
- `OrganizationSettingsRepository`
  - `save(settings: OrganizationSettings): Promise<void>`
  - `findByCompanyId(companyId: CompanyId): Promise<OrganizationSettings | null>`

---

## 📋 Service Order

### Aggregate Root: ServiceOrder

**Responsabilidade:** Representa uma ordem de serviço com seu ciclo de vida completo.

**Boundaries:**
- Contém informações da ordem
- Gerencia histórico de alterações
- Controla atribuições de responsáveis
- Mantém integridade do ciclo de vida

**Entities:**
- `ServiceOrder` (Aggregate Root)
- `ServiceOrderHistory` (Entity dentro do Aggregate - registro de alterações)
- `Assignment` (Entity dentro do Aggregate - responsáveis)

**Value Objects:**
- `ServiceOrderId`
- `CompanyId` (referência)
- `UserId` (referência - criador)
- `Description`
- `Priority`
- `Money`
- `Status`
- `AssignmentType` (PRIMARY, AUXILIARY, OBSERVER)
- `HistoryEntryId`

**Domain Events:**
- `ServiceOrderCreatedEvent`
- `ServiceOrderDescriptionUpdatedEvent`
- `ServiceOrderPriorityChangedEvent`
- `ServiceOrderValueUpdatedEvent`
- `ServiceOrderStartedEvent`
- `ServiceOrderInProgressEvent`
- `ServiceOrderPausedEvent`
- `ServiceOrderResumedEvent`
- `ServiceOrderCompletedEvent`
- `ServiceOrderCancelledEvent`
- `ServiceOrderRejectedEvent`
- `ServiceOrderAssignedEvent`
- `ServiceOrderUnassignedEvent`
- `ServiceOrderHistoryAddedEvent`

**Repository Interface:**
- `ServiceOrderRepository`
  - `save(order: ServiceOrder): Promise<void>`
  - `findById(id: ServiceOrderId): Promise<ServiceOrder | null>`
  - `findByCompanyId(companyId: CompanyId): Promise<ServiceOrder[]>`
  - `findByUserId(userId: UserId): Promise<ServiceOrder[]>`
  - `findByStatus(status: Status): Promise<ServiceOrder[]>`
  - `findByPriority(priority: Priority): Promise<ServiceOrder[]>`
  - `delete(id: ServiceOrderId): Promise<void>`

**Regras de Invariantes:**
- Ordem deve pertencer a uma empresa válida
- Ordem deve ter descrição não vazia
- Valor não pode ser negativo
- Status deve seguir máquina de estados
- Ordem iniciada deve ter pelo menos um responsável principal
- Histórico não pode ser modificado após criado

**Máquina de Estados:**
```
CREATED
  ├─→ STARTED (quando iniciada)
  │     ├─→ IN_PROGRESS (quando trabalho começa)
  │     │     ├─→ PAUSED (pausa temporária)
  │     │     │     └─→ IN_PROGRESS (retomada)
  │     │     ├─→ COMPLETED (finalização)
  │     │     └─→ REJECTED (rejeição)
  │     └─→ CANCELLED (cancelamento)
  └─→ CANCELLED (cancelamento antes de iniciar)
```

---

## 💰 Financial

### Aggregate Root: Transaction

**Responsabilidade:** Representa uma movimentação financeira no sistema.

**Boundaries:**
- Contém informações da transação
- Mantém integridade financeira
- Controla aprovações quando necessário

**Entities:**
- `Transaction` (Aggregate Root)

**Value Objects:**
- `TransactionId`
- `CompanyId` (referência)
- `ServiceOrderId` (referência opcional)
- `TransactionType` (INCOME, EXPENSE)
- `Money`
- `Currency`
- `TransactionStatus` (PENDING, APPROVED, REJECTED, PROCESSED)
- `PaymentMethod` (para pagamentos)
- `Description`

**Domain Events:**
- `TransactionCreatedEvent`
- `TransactionApprovedEvent`
- `TransactionRejectedEvent`
- `TransactionProcessedEvent`
- `TransactionCancelledEvent`
- `TransactionValueUpdatedEvent`

**Repository Interface:**
- `TransactionRepository`
  - `save(transaction: Transaction): Promise<void>`
  - `findById(id: TransactionId): Promise<Transaction | null>`
  - `findByCompanyId(companyId: CompanyId): Promise<Transaction[]>`
  - `findByServiceOrderId(serviceOrderId: ServiceOrderId): Promise<Transaction[]>`
  - `findByType(type: TransactionType): Promise<Transaction[]>`
  - `findByStatus(status: TransactionStatus): Promise<Transaction[]>`
  - `findByDateRange(companyId: CompanyId, startDate: Date, endDate: Date): Promise<Transaction[]>`

**Regras de Invariantes:**
- Transação deve pertencer a uma empresa válida
- Valor não pode ser zero
- Transação não pode ser deletada (apenas estornada)
- Transação processada não pode ser alterada
- Transação requer aprovação se valor exceder limite da empresa

---

### Aggregate Root: Invoice

**Responsabilidade:** Representa uma fatura fiscal emitida.

**Boundaries:**
- Contém informações fiscais
- Associa ordens de serviço
- Controla status de emissão

**Entities:**
- `Invoice` (Aggregate Root)
- `InvoiceItem` (Entity dentro do Aggregate - itens da fatura)

**Value Objects:**
- `InvoiceId`
- `InvoiceNumber` (NFe)
- `CompanyId` (referência - emissor)
- `ClientCompanyId` (referência - cliente)
- `Money` (valor total)
- `TaxAmount`
- `IssueDate`
- `DueDate`
- `InvoiceStatus` (DRAFT, ISSUED, CANCELLED)
- `ServiceOrderId` (referência - para InvoiceItem)

**Domain Events:**
- `InvoiceCreatedEvent`
- `InvoiceItemAddedEvent`
- `InvoiceItemRemovedEvent`
- `InvoiceIssuedEvent`
- `InvoiceCancelledEvent`
- `InvoiceValueUpdatedEvent`

**Repository Interface:**
- `InvoiceRepository`
  - `save(invoice: Invoice): Promise<void>`
  - `findById(id: InvoiceId): Promise<Invoice | null>`
  - `findByNumber(number: InvoiceNumber): Promise<Invoice | null>`
  - `findByCompanyId(companyId: CompanyId): Promise<Invoice[]>`
  - `findByServiceOrderId(serviceOrderId: ServiceOrderId): Promise<Invoice[]>`
  - `findByStatus(status: InvoiceStatus): Promise<Invoice[]>`

**Regras de Invariantes:**
- Fatura deve ter pelo menos um item
- Número de fatura deve ser único
- Fatura emitida não pode ser alterada
- Fatura cancelada não pode ser reemitida
- Valor total deve ser soma dos itens + impostos

---

### Aggregate Root: Balance

**Responsabilidade:** Representa o saldo financeiro de uma empresa.

**Nota:** Pode ser calculado a partir de transações ou mantido como aggregate separado para performance.

**Entities:**
- `Balance` (Aggregate Root)

**Value Objects:**
- `CompanyId` (referência)
- `Money` (saldo disponível)
- `Money` (saldo bloqueado)
- `Currency`
- `LastUpdatedAt`

**Domain Events:**
- `BalanceUpdatedEvent`
- `BalanceBlockedEvent`
- `BalanceUnblockedEvent`

**Repository Interface:**
- `BalanceRepository`
  - `save(balance: Balance): Promise<void>`
  - `findByCompanyId(companyId: CompanyId): Promise<Balance | null>`
  - `updateBalance(companyId: CompanyId, amount: Money, type: TransactionType): Promise<void>`

**Regras de Invariantes:**
- Saldo não pode ficar negativo (sem limite de crédito)
- Saldo bloqueado não pode ser usado
- Saldo é recalculado a cada transação
- Saldo deve ser consistente com soma de transações

---

## 📊 Resumo por Contexto

### Identity & Access
- **Aggregates:** User, Role (opcional)
- **Complexidade:** Média
- **Dependências:** Nenhuma

### Organization
- **Aggregates:** Company, OrganizationSettings
- **Complexidade:** Média
- **Dependências:** Identity & Access

### Service Order
- **Aggregates:** ServiceOrder
- **Complexidade:** Alta (máquina de estados complexa)
- **Dependências:** Organization, Identity & Access

### Financial
- **Aggregates:** Transaction, Invoice, Balance
- **Complexidade:** Alta (regras financeiras críticas)
- **Dependências:** Service Order, Organization

---

## 🎯 Decisões de Design

### 1. Boundaries dos Aggregates

- **ServiceOrder** contém History e Assignments para manter consistência
- **Company** contém Departments para facilitar gestão organizacional
- **Invoice** contém Items para manter integridade da fatura
- **User** contém Sessions para controle de autenticação

### 2. Value Objects vs Entities

- IDs são sempre Value Objects
- Conceitos que têm identidade própria são Entities
- Conceitos que são definidos apenas por valores são Value Objects
- Money, Priority, Status são Value Objects

### 3. Domain Events

- Eventos são publicados quando algo significativo acontece
- Eventos são imutáveis
- Eventos contêm apenas dados necessários
- Eventos são usados para comunicação entre contextos

### 4. Repository Interfaces

- Interfaces ficam no domínio
- Implementações ficam na infraestrutura
- Repositories trabalham apenas com Aggregate Roots
- Queries complexas podem ter interfaces separadas

---

## 📝 Próximos Passos

1. Implementar Value Objects base
2. Implementar Entities e Aggregate Roots
3. Definir Domain Events completos
4. Criar Repository Interfaces
5. Implementar regras de negócio e invariantes
6. Criar testes unitários do domínio

---

**Nota:** Este documento deve ser atualizado conforme novos aggregates são identificados ou quando regras de negócio mudam.

