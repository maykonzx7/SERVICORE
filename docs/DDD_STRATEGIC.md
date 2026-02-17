# ServiCore — Modelagem Estratégica DDD

> Documento de mapeamento dos Bounded Contexts e suas relações

**Última atualização:** 2024  
**Versão:** 1.0.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Bounded Contexts](#bounded-contexts)
3. [Context Map](#context-map)
4. [Dependências entre Contextos](#dependências-entre-contextos)
5. [Subdomínios](#subdomínios)

---

## 🎯 Visão Geral

O ServiCore é uma plataforma multi-tenant para gestão de ordens de serviço e processos financeiros. A arquitetura é baseada em DDD Estratégico, organizando o sistema em Bounded Contexts bem definidos.

### Princípios

- **Isolamento de Contextos**: Cada contexto possui sua própria linguagem ubíqua
- **Dependências Explícitas**: Relações entre contextos são claramente definidas
- **Autonomia**: Cada contexto pode evoluir independentemente
- **Comunicação via Events**: Contextos se comunicam principalmente através de eventos de domínio

---

## 🏗️ Bounded Contexts

### 1. Identity & Access

**Responsabilidade:** Autenticação, autorização e gestão de identidade de usuários.

**Subdomínio:** Supporting

**Conceitos Principais:**
- Usuário (User)
- Role (Papel)
- Permission (Permissão)
- Session (Sessão)
- Token (JWT)

**Dependências:** Nenhuma (contexto independente)

**Interfaces Expostas:**
- Autenticação de usuários
- Validação de tokens
- Verificação de permissões
- Gestão de sessões

**Eventos Publicados:**
- `UserCreated`
- `UserAuthenticated`
- `UserRoleChanged`
- `SessionExpired`

---

### 2. Organization

**Responsabilidade:** Gestão multi-tenant, empresas e configurações organizacionais.

**Subdomínio:** Supporting

**Conceitos Principais:**
- Empresa (Company)
- Tenant (Inquilino)
- Departamento (Department)
- Configuração Organizacional (OrganizationSettings)

**Dependências:**
- Identity & Access (para associar usuários a empresas)

**Interfaces Expostas:**
- Gestão de empresas
- Associação de usuários a empresas
- Configurações por tenant
- Hierarquia organizacional

**Eventos Publicados:**
- `CompanyCreated`
- `CompanyUpdated`
- `UserAssignedToCompany`
- `DepartmentCreated`

**Eventos Consumidos:**
- `UserCreated` (do Identity & Access)

---

### 3. Service Order

**Responsabilidade:** Gestão completa do ciclo de vida de ordens de serviço.

**Subdomínio:** Core

**Conceitos Principais:**
- Ordem de Serviço (ServiceOrder)
- Prioridade (Priority)
- Status (Status)
- Valor (Money)
- Histórico (History)
- Atribuição (Assignment)

**Dependências:**
- Organization (para associar ordens a empresas)
- Identity & Access (para identificar responsáveis)

**Interfaces Expostas:**
- Criação de ordens de serviço
- Atualização de status
- Atribuição de responsáveis
- Consulta de ordens

**Eventos Publicados:**
- `ServiceOrderCreated`
- `ServiceOrderStarted`
- `ServiceOrderInProgress`
- `ServiceOrderCompleted`
- `ServiceOrderCancelled`
- `ServiceOrderAssigned`

**Eventos Consumidos:**
- `CompanyCreated` (do Organization)
- `UserCreated` (do Identity & Access)

---

### 4. Financial

**Responsabilidade:** Gestão financeira, pagamentos, faturas e transações.

**Subdomínio:** Core

**Conceitos Principais:**
- Transação (Transaction)
- Pagamento (Payment)
- Fatura (Invoice)
- Conta a Receber (Receivable)
- Conta a Pagar (Payable)
- Saldo (Balance)

**Dependências:**
- Service Order (para associar transações a ordens de serviço)
- Organization (para gestão financeira por empresa)

**Interfaces Expostas:**
- Registro de transações
- Processamento de pagamentos
- Geração de faturas
- Consulta de saldos

**Eventos Publicados:**
- `PaymentReceived`
- `PaymentProcessed`
- `InvoiceGenerated`
- `TransactionCreated`
- `BalanceUpdated`

**Eventos Consumidos:**
- `ServiceOrderCompleted` (do Service Order)
- `ServiceOrderCreated` (do Service Order)

---

### 5. Notifications (Futuro)

**Responsabilidade:** Sistema de notificações e comunicação.

**Subdomínio:** Generic

**Conceitos Principais:**
- Notificação (Notification)
- Canal (Channel)
- Template (Template)
- Preferências (Preferences)

**Dependências:**
- Todos os outros contextos (consome eventos)

**Interfaces Expostas:**
- Envio de notificações
- Gestão de templates
- Preferências de usuário

**Eventos Consumidos:**
- Todos os eventos de domínio dos outros contextos

---

### 6. Reports (Futuro)

**Responsabilidade:** Geração de relatórios e análises.

**Subdomínio:** Generic

**Conceitos Principais:**
- Relatório (Report)
- Dashboard (Dashboard)
- Métrica (Metric)
- Agregação (Aggregation)

**Dependências:**
- Todos os outros contextos (consome dados)

**Interfaces Expostas:**
- Geração de relatórios
- Dashboards personalizados
- Exportação de dados

---

## 🗺️ Context Map

```
┌─────────────────────┐
│ Identity & Access  │ (Independente)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Organization      │ (Supporting)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Service Order     │ (Core)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Financial       │ (Core)
└─────────────────────┘

┌─────────────────────┐
│   Notifications     │ (Generic - Consome eventos)
└─────────────────────┘

┌─────────────────────┐
│      Reports        │ (Generic - Consome dados)
└─────────────────────┘
```

---

## 🔗 Dependências entre Contextos

### Fluxo de Dependências

1. **Identity & Access** → Base independente
2. **Organization** → Depende de Identity & Access
3. **Service Order** → Depende de Organization e Identity & Access
4. **Financial** → Depende de Service Order e Organization
5. **Notifications** → Consome eventos de todos os contextos
6. **Reports** → Consome dados de todos os contextos

### Padrões de Integração

- **Shared Kernel:** Nenhum (cada contexto é independente)
- **Customer-Supplier:** Organization fornece dados para Service Order
- **Conformist:** Financial segue eventos de Service Order
- **Anticorruption Layer:** Não necessário no momento
- **Published Language:** Eventos de domínio como linguagem comum
- **Open Host Service:** Cada contexto expõe APIs REST

---

## 📊 Subdomínios

### Core Domain (Domínio Central)

- **Service Order**: Coração do negócio
- **Financial**: Essencial para operação

### Supporting Domain (Domínio de Suporte)

- **Identity & Access**: Necessário mas não diferenciador
- **Organization**: Necessário mas não diferenciador

### Generic Domain (Domínio Genérico)

- **Notifications**: Pode ser substituído por serviços externos
- **Reports**: Pode ser substituído por ferramentas de BI

---

## 🎯 Decisões Estratégicas

### 1. Separação de Contextos

Cada contexto possui:
- Modelo de domínio próprio
- Banco de dados lógico separado (via schemas no PostgreSQL)
- API REST independente
- Eventos de domínio próprios

### 2. Comunicação entre Contextos

- **Síncrona:** REST APIs para operações que requerem resposta imediata
- **Assíncrona:** RabbitMQ para eventos de domínio e operações que podem ser processadas posteriormente

### 3. Multi-tenancy

- Implementado no contexto Organization
- Todos os outros contextos respeitam o isolamento por tenant
- Filtros automáticos por companyId em todas as consultas

### 4. Evolução Futura

- Cada contexto pode evoluir para microserviço independente
- Eventos de domínio facilitam a migração
- APIs REST permitem desacoplamento gradual

---

## 📝 Notas de Implementação

### Ordem de Desenvolvimento

1. **Identity & Access** (primeiro - base)
2. **Organization** (segundo - depende de Identity)
3. **Service Order** (terceiro - depende de Organization)
4. **Financial** (quarto - depende de Service Order)
5. **Notifications** (quinto - consome eventos)
6. **Reports** (sexto - consome dados)

### Considerações Técnicas

- Cada contexto terá seu próprio módulo NestJS
- Schemas Prisma separados por contexto (mesmo banco, schemas diferentes)
- Eventos de domínio publicados via RabbitMQ
- Cache compartilhado via Redis (opcional)

---

**Próximos Passos:**
1. Definir Linguagem Ubíqua detalhada para cada contexto
2. Identificar Aggregates, Entities e Value Objects
3. Mapear Domain Events completos
4. Definir contratos de API entre contextos

