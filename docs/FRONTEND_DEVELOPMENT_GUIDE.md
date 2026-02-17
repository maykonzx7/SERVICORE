# ServiCore — Guia de Desenvolvimento Frontend

> Guia completo para desenvolvimento frontend seguindo DDD + Hexagonal + CQRS Leve + Multi-tenant

**Última atualização:** 2026  
**Versão:** 1.0.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Ordem de Implementação Integrada](#ordem-de-implementação-integrada)
3. [Arquitetura Frontend](#arquitetura-frontend)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Padrões de Código](#padrões-de-código)
6. [Módulos e Features](#módulos-e-features)
7. [Gerenciamento de Estado](#gerenciamento-de-estado)
8. [Comunicação com Backend](#comunicação-com-backend)
9. [Multi-Tenancy no Frontend](#multi-tenancy-no-frontend)
10. [Autenticação e Autorização](#autenticação-e-autorização)
11. [Componentes e UI](#componentes-e-ui)
12. [Roteamento](#roteamento)
13. [Testes](#testes)
14. [Performance e Otimização](#performance-e-otimização)
15. [Boas Práticas](#boas-práticas)
16. [Checklist de Desenvolvimento](#checklist-de-desenvolvimento)

---

## 🎯 Visão Geral

O frontend do ServiCore é uma aplicação corporacional construída com **Vue 3 + TypeScript**, seguindo os mesmos princípios arquiteturais do backend:

- **DDD Estratégico**: Organização por módulos (Bounded Contexts)
- **Separação de Responsabilidades**: Camadas bem definidas
- **CQRS Leve**: Separação entre comandos (write) e queries (read)
- **Multi-tenant**: Isolamento de dados por empresa
- **Type Safety**: TypeScript em todo o código

### Stack Tecnológica

- **Framework**: Vue 3 (Composition API)
- **Linguagem**: TypeScript
- **Build Tool**: Vite
- **Roteamento**: Vue Router 4
- **Estado Global**: Pinia
- **HTTP Client**: Axios
- **Validação**: (a definir - Zod ou Yup)

---

## 🔄 Ordem de Implementação Integrada

> **Importante:** O frontend deve ser desenvolvido em paralelo/complemento ao backend, seguindo a mesma ordem de módulos e respeitando as dependências.

### Visão Geral da Integração

O desenvolvimento frontend segue a mesma ordem estratégica do backend, mas pode começar assim que os **contratos de API** (DTOs e endpoints) estiverem definidos, mesmo antes da implementação completa da infraestrutura.

```
┌─────────────────────────────────────────────────────────────┐
│              FASE 0: BASE COMPARTILHADA                     │
│  Backend: shared/domain, shared/application                 │
│  Frontend: shared/api, shared/components, shared/stores    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         FASE 1: IDENTITY & ACCESS (Módulo Base)             │
│  Backend: Domain → Application → Infrastructure → API      │
│  Frontend: Types → API Client → Store → Components → Views │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         FASE 2: ORGANIZATION (Multi-tenant)                 │
│  Backend: Domain → Application → Infrastructure → API       │
│  Frontend: Types → API Client → Store → Components → Views │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────────┐          ┌──────────────────────┐
│   FASE 3A: SERVICE   │          │   FASE 3B: FINANCIAL │
│       ORDER          │          │                       │
│  Backend: Domain →   │          │  Backend: Domain →   │
│  Application → API   │          │  Application → API   │
│  Frontend: Types →   │          │  Frontend: Types →   │
│  API Client → Store  │          │  API Client → Store  │
└──────────────────────┘          └──────────────────────┘
```

### Fase 0: Base Compartilhada (Frontend)

**Quando começar:** Imediatamente após setup inicial

**O que implementar:**

1. **API Client Base** (`shared/api/client.ts`)
   - Configuração do Axios
   - Interceptors (auth, errors)
   - Tipos base de API

2. **Componentes Base** (`shared/components/ui/`)
   - Button, Input, Modal, Table
   - Layouts (Header, Sidebar, Footer)

3. **Stores Globais Base** (`shared/stores/`)
   - `app.store.ts` - Estado global da aplicação
   - Estrutura para `auth.store.ts` e `company.store.ts`

4. **Router Base** (`shared/router/`)
   - Configuração do Vue Router
   - Route guards básicos
   - Layouts

5. **Utilitários** (`shared/utils/`)
   - Formatters (date, money)
   - Validators
   - Helpers

**Dependências Backend:** Nenhuma (pode ser desenvolvido em paralelo)

---

### Fase 1: Identity & Access (Módulo Base)

**Quando começar:** Após backend ter **Presentation Layer** (Controllers) implementado

**Ordem de Implementação Frontend:**

#### 1.1 Types e Interfaces

**Quando:** Assim que backend definir DTOs

```typescript
// modules/auth/types/auth.types.ts
export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  roles: string[]
  permissions: string[]
}
```

**Dependências Backend:** ✅ DTOs definidos (pode ser apenas documentação)

#### 1.2 API Client

**Quando:** Após endpoints estarem disponíveis (mesmo que mockados)

```typescript
// modules/auth/api/auth.api.ts
export const authApi = {
  login: (credentials: LoginCredentials) => 
    apiClient.post('/auth/login', credentials),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  getCurrentUser: () => 
    apiClient.get('/auth/me'),
}
```

**Dependências Backend:** ✅ Controllers implementados (pode usar mocks temporariamente)

#### 1.3 Store (Pinia)

**Quando:** Após API Client estar pronto

```typescript
// modules/auth/stores/auth.store.ts
export const useAuthStore = defineStore('auth', () => {
  // Estado e ações de autenticação
})
```

**Dependências Backend:** ✅ API Client funcionando

#### 1.4 Components e Views

**Quando:** Após Store estar pronta

- `LoginView.vue`
- `LoginForm.vue`
- Integração com route guards

**Dependências Backend:** ✅ Store funcionando

---

### Fase 2: Organization (Multi-tenant)

**Quando começar:** Após Identity & Access ter **Store e Components** implementados

**Ordem de Implementação Frontend:**

#### 2.1 Types e Interfaces

**Quando:** Assim que backend definir DTOs de Company

**Dependências Backend:** ✅ DTOs definidos

#### 2.2 API Client

**Quando:** Após endpoints estarem disponíveis

**Dependências Backend:** ✅ Controllers implementados

#### 2.3 Store (Company Store)

**Quando:** Após API Client estar pronto

**Importante:** Esta store é **global** (`shared/stores/company.store.ts`) pois é usada por todos os módulos

**Dependências Backend:** ✅ API Client funcionando

#### 2.4 Components e Views

**Quando:** Após Store estar pronta

- `CompanySelectionView.vue`
- `CompanySwitcher.vue`
- Integração com outros módulos

**Dependências Backend:** ✅ Store funcionando

---

### Fase 3A: Service Order (Core Domain)

**Quando começar:** Após Organization ter **Store** implementada

**Ordem de Implementação Frontend:**

#### 3A.1 Types e Interfaces

**Quando:** Assim que backend definir DTOs

**Dependências Backend:** ✅ DTOs definidos (Read e Write)

#### 3A.2 API Client (Separação CQRS)

**Quando:** Após endpoints estarem disponíveis

```typescript
// modules/service-orders/api/service-order.api.ts
export const serviceOrderApi = {
  // Commands (Write Side)
  create: (data: CreateServiceOrderDto) => ...,
  update: (id: string, data: UpdateServiceOrderDto) => ...,
  start: (id: string) => ...,
  complete: (id: string) => ...,
  cancel: (id: string) => ...,
  
  // Queries (Read Side)
  list: (companyId: string, page: number, limit: number) => ...,
  getById: (id: string) => ...,
  search: (filters: SearchFilters) => ...,
}
```

**Dependências Backend:** ✅ Controllers (Write e Read) implementados

#### 3A.3 Stores (Separação CQRS - Opcional)

**Quando:** Após API Client estar pronto

**Opção 1: Store Única**
```typescript
// modules/service-orders/stores/service-order.store.ts
// Contém comandos e queries
```

**Opção 2: Stores Separadas (CQRS)**
```typescript
// modules/service-orders/stores/service-order-command.store.ts
// Apenas comandos (write)

// modules/service-orders/stores/service-order-query.store.ts
// Apenas queries (read)
```

**Dependências Backend:** ✅ API Client funcionando

#### 3A.4 Components

**Quando:** Após Stores estarem prontas

**Write Side:**
- `ServiceOrderForm.vue` - Criar/Editar
- `ServiceOrderActions.vue` - Ações (start, complete, cancel)

**Read Side:**
- `ServiceOrderCard.vue` - Card de exibição
- `ServiceOrderTable.vue` - Tabela de listagem
- `ServiceOrderFilters.vue` - Filtros de busca

**Dependências Backend:** ✅ Stores funcionando

#### 3A.5 Views

**Quando:** Após Components estarem prontos

- `ServiceOrdersView.vue` - Lista (usa Query Store)
- `ServiceOrderCreateView.vue` - Criação (usa Command Store)
- `ServiceOrderDetailsView.vue` - Detalhes (usa Query Store)

**Dependências Backend:** ✅ Components funcionando

---

### Fase 3B: Financial (Core Domain)

**Quando começar:** Após Service Order ter **API Client** implementado (pode ser paralelo após isso)

**Ordem de Implementação:** Mesma estrutura de Service Order

**Dependências Backend:** ✅ Service Order com Controllers implementados

---

### Cronograma de Desenvolvimento Integrado

#### Sprint 1: Base + Identity & Access ✅ CONCLUÍDO

**Backend:**
- [x] Fase 0: Base Compartilhada
- [x] Fase 1: Identity & Access (Domain → Application → Infrastructure → Presentation)

**Frontend (em paralelo após Presentation do Backend):**
- [x] Fase 0: Base Compartilhada (API Client, Components Base, Router)
- [x] Fase 1: Identity & Access (Types → API Client → Store → Components → Views)

**Resultado:** ✅ Sistema de autenticação completo funcionando

---

#### Sprint 2: Organization (Multi-tenant) ✅ CONCLUÍDO

**Backend:**
- [x] Fase 2: Organization (Domain → Application → Infrastructure → Presentation)

**Frontend (em paralelo após Presentation do Backend):**
- [x] Fase 2: Organization (Types → API Client → Store → Components → Views)
- [x] Integração multi-tenant em todos os módulos

**Resultado:** ✅ Multi-tenancy funcionando, usuários podem selecionar empresa

---

#### Sprint 3: Service Order (Core) ✅ CONCLUÍDO

**Backend:**
- [x] Fase 3: Service Order (Domain → Application → Infrastructure → Presentation)

**Frontend (em paralelo após Presentation do Backend):**
- [x] Fase 3A: Service Order (Types → API Client → Stores → Components → Views)
- [x] Implementação completa do módulo

**Resultado:** ✅ Módulo de Ordens de Serviço completo

---

#### Sprint 4: Financial (Core)

**Backend:**
- [ ] Fase 4: Financial (Domain → Application → Infrastructure → Presentation)

**Frontend (em paralelo após Presentation do Backend):**
- [ ] Fase 3B: Financial (Types → API Client → Stores → Components → Views)
- [ ] Implementação completa do módulo

**Resultado:** Módulo Financeiro completo

---

### Regras de Ouro para Desenvolvimento Integrado

#### ✅ PODE fazer em paralelo:

1. **Frontend Base** com **Backend Base** (Fase 0)
2. **Frontend Types/Interfaces** assim que **Backend DTOs** estiverem definidos
3. **Frontend API Client** assim que **Backend Controllers** estiverem implementados
4. **Frontend Components/Views** após **API Client** estar pronto
5. **Módulos diferentes** após dependências estarem resolvidas

#### ❌ NÃO PODE fazer em paralelo:

1. **Frontend Store** antes de **Backend API** estar disponível
2. **Frontend Components** antes de **Frontend Store** estar pronta
3. **Frontend de módulo dependente** antes do **módulo base** estar completo
4. **Frontend** antes de **Backend Presentation** estar implementado (exceto Types)

#### 🔄 Pode começar quando:

- **Frontend Base:** Imediatamente (sem dependências)
- **Frontend Types:** Após Backend definir DTOs (pode ser apenas documentação)
- **Frontend API Client:** Após Backend ter Controllers (pode usar mocks temporariamente)
- **Frontend Store:** Após API Client estar funcionando
- **Frontend Components:** Após Store estar pronta
- **Frontend Views:** Após Components estarem prontos

---

### Exemplo Prático: Desenvolvimento do Módulo Service Order

#### Semana 1: Backend Domain + Frontend Types

**Backend Developer:**
- Implementa Value Objects, Entities, Aggregate
- Define Repository Interface
- Define Domain Events

**Frontend Developer (em paralelo):**
- Define Types TypeScript baseado em DTOs documentados
- Cria interfaces para ServiceOrder, CreateServiceOrderDto, etc.
- Prepara estrutura de pastas do módulo

**Resultado:** Tipos alinhados entre backend e frontend

---

#### Semana 2: Backend Application + Frontend API Client

**Backend Developer:**
- Implementa Use Cases (Write Side)
- Implementa Queries (Read Side)
- Define DTOs finais

**Frontend Developer (após DTOs definidos):**
- Cria API Client com todos os endpoints
- Implementa métodos de Command (create, update, start, complete, cancel)
- Implementa métodos de Query (list, getById, search)
- Configura interceptors se necessário

**Resultado:** API Client pronto para uso

---

#### Semana 3: Backend Infrastructure + Frontend Store

**Backend Developer:**
- Implementa Repository (Prisma)
- Implementa Query Service (Prisma)
- Testa integração completa

**Frontend Developer (após API estar funcionando):**
- Cria Store Pinia com estado e ações
- Implementa actions de Command
- Implementa actions de Query
- Adiciona loading states e error handling

**Resultado:** Store completa e funcional

---

#### Semana 4: Backend Presentation + Frontend Components

**Backend Developer:**
- Implementa Controllers
- Configura rotas
- Testa endpoints completos

**Frontend Developer (após Store estar pronta):**
- Cria Components (Form, Card, Table, Filters)
- Implementa validações de formulário
- Adiciona feedback visual (loading, errors)

**Resultado:** Componentes funcionais

---

#### Semana 5: Integração + Frontend Views

**Backend Developer:**
- Testes de integração
- Ajustes finais

**Frontend Developer:**
- Cria Views (List, Create, Details)
- Configura rotas
- Integra tudo
- Testes E2E básicos

**Resultado:** Módulo completo e funcional

---

## 🏗️ Arquitetura Frontend

### Princípios Arquiteturais

1. **Modularidade**: Cada módulo representa um Bounded Context
2. **Isolamento**: Módulos não dependem diretamente uns dos outros
3. **Reutilização**: Componentes e utilitários compartilhados em `shared/`
4. **Type Safety**: Tipos TypeScript em todas as camadas
5. **Separação CQRS**: Stores separadas para comandos e queries quando necessário

### Camadas da Aplicação

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (Views, Components, Router)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Application Layer               │
│  (Stores, Composables, Services)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Domain Layer                    │
│  (Types, Interfaces, Constants)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Infrastructure Layer            │
│  (API Clients, HTTP, Storage)        │
└──────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

### Estrutura Oficial

```
frontend/
├── public/                    # Arquivos estáticos
│   ├── favicon.ico
│   └── assets/
│
├── src/
│   ├── main.ts                # Entry point
│   ├── App.vue                # Root component
│   │
│   ├── modules/               # Módulos (Bounded Contexts)
│   │   ├── auth/
│   │   │   ├── components/   # Componentes específicos do módulo
│   │   │   ├── views/        # Páginas/Views
│   │   │   ├── stores/       # Pinia stores
│   │   │   ├── composables/  # Composables Vue
│   │   │   ├── types/        # Tipos TypeScript do módulo
│   │   │   └── router/        # Rotas do módulo (opcional)
│   │   │
│   │   ├── organization/
│   │   │   ├── components/
│   │   │   ├── views/
│   │   │   ├── stores/
│   │   │   ├── composables/
│   │   │   └── types/
│   │   │
│   │   ├── service-orders/
│   │   │   ├── components/
│   │   │   ├── views/
│   │   │   ├── stores/
│   │   │   ├── composables/
│   │   │   └── types/
│   │   │
│   │   └── financial/
│   │       ├── components/
│   │       ├── views/
│   │       ├── stores/
│   │       ├── composables/
│   │       └── types/
│   │
│   ├── shared/                # Recursos compartilhados
│   │   ├── api/              # API clients
│   │   │   ├── client.ts     # Axios instance configurado
│   │   │   ├── interceptors/ # Request/Response interceptors
│   │   │   └── types/        # Tipos de API
│   │   │
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── ui/          # Componentes de UI básicos
│   │   │   │   ├── Button.vue
│   │   │   │   ├── Input.vue
│   │   │   │   ├── Modal.vue
│   │   │   │   └── Table.vue
│   │   │   └── layout/      # Componentes de layout
│   │   │       ├── Header.vue
│   │   │       ├── Sidebar.vue
│   │   │       └── Footer.vue
│   │   │
│   │   ├── composables/      # Composables reutilizáveis
│   │   │   ├── useAuth.ts
│   │   │   ├── useCompany.ts
│   │   │   ├── usePagination.ts
│   │   │   └── useToast.ts
│   │   │
│   │   ├── layouts/          # Layouts da aplicação
│   │   │   ├── DefaultLayout.vue
│   │   │   ├── AuthLayout.vue
│   │   │   └── DashboardLayout.vue
│   │   │
│   │   ├── router/           # Configuração de rotas
│   │   │   ├── index.ts
│   │   │   ├── guards.ts    # Route guards
│   │   │   └── routes/       # Definição de rotas por módulo
│   │   │
│   │   ├── stores/          # Stores globais
│   │   │   ├── auth.store.ts
│   │   │   ├── company.store.ts
│   │   │   └── app.store.ts
│   │   │
│   │   ├── types/            # Tipos compartilhados
│   │   │   ├── api.types.ts
│   │   │   ├── common.types.ts
│   │   │   └── domain.types.ts
│   │   │
│   │   ├── utils/            # Utilitários
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── date.ts
│   │   │   └── money.ts
│   │   │
│   │   └── constants/        # Constantes
│   │       ├── routes.ts
│   │       ├── api.ts
│   │       └── enums.ts
│   │
│   └── styles/               # Estilos globais
│       ├── main.css
│       ├── variables.css
│       └── components.css
│
├── .env.example
├── .env.local
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📝 Padrões de Código

### 1. Nomenclatura

#### Arquivos e Pastas

- **Componentes Vue**: PascalCase (`ServiceOrderForm.vue`)
- **Views**: PascalCase com sufixo `View` (`ServiceOrdersView.vue`)
- **Stores**: kebab-case com sufixo `.store.ts` (`service-order.store.ts`)
- **Composables**: camelCase com prefixo `use` (`useServiceOrder.ts`)
- **Types**: kebab-case com sufixo `.types.ts` (`service-order.types.ts`)
- **API Clients**: kebab-case com sufixo `.api.ts` (`service-order.api.ts`)

#### Variáveis e Funções

- **Variáveis**: camelCase (`serviceOrder`, `isLoading`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Funções**: camelCase (`createServiceOrder`, `loadOrders`)
- **Interfaces/Types**: PascalCase (`ServiceOrderResponse`, `CreateServiceOrderDto`)

### 2. Estrutura de Componentes Vue

```vue
<template>
  <!-- Template com estrutura clara -->
  <div class="service-order-form">
    <h2>Criar Ordem de Serviço</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Formulário -->
    </form>
  </div>
</template>

<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'
import { useServiceOrderStore } from '@/modules/service-orders/stores/service-order.store'
import type { CreateServiceOrderDto } from '@/shared/api/service-order.api'

// 2. Props (se houver)
interface Props {
  companyId: string
}
const props = defineProps<Props>()

// 3. Emits (se houver)
const emit = defineEmits<{
  created: [orderId: string]
  cancelled: []
}>()

// 4. Stores/Composables
const serviceOrderStore = useServiceOrderStore()

// 5. State local
const form = ref<CreateServiceOrderDto>({
  companyId: props.companyId,
  description: '',
  priority: 'MEDIUM',
  value: 0,
})

// 6. Computed
const isValid = computed(() => {
  return form.value.description.length > 0 && form.value.value >= 0
})

// 7. Methods
async function handleSubmit() {
  try {
    const order = await serviceOrderStore.createOrder(form.value)
    emit('created', order.id)
    resetForm()
  } catch (error) {
    // Tratamento de erro
  }
}

function resetForm() {
  form.value = {
    companyId: props.companyId,
    description: '',
    priority: 'MEDIUM',
    value: 0,
  }
}
</script>

<style scoped>
.service-order-form {
  /* Estilos scoped */
}
</style>
```

### 3. Estrutura de Stores (Pinia)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { serviceOrderApi, type ServiceOrderResponse } from '@/shared/api/service-order.api'

export const useServiceOrderStore = defineStore('serviceOrder', () => {
  // ========== STATE ==========
  const orders = ref<ServiceOrderResponse[]>([])
  const currentOrder = ref<ServiceOrderResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== GETTERS ==========
  const hasOrders = computed(() => orders.value.length > 0)
  const isLoading = computed(() => loading.value)

  // ========== ACTIONS ==========
  async function loadOrders(companyId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await serviceOrderApi.list(companyId)
      orders.value = response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar ordens'
      throw err
    } finally {
      loading.value = false
    }
  }

  function reset() {
    orders.value = []
    currentOrder.value = null
    error.value = null
  }

  // ========== RETURN ==========
  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    // Getters
    hasOrders,
    isLoading,
    // Actions
    loadOrders,
    reset,
  }
})
```

### 4. Estrutura de API Clients

```typescript
import { apiClient } from '@/shared/api/client'
import type { ServiceOrderResponse, CreateServiceOrderDto } from './types'

export const serviceOrderApi = {
  // Commands (Write Side)
  create: (data: CreateServiceOrderDto) =>
    apiClient.post<ServiceOrderResponse>('/service-orders', data),

  update: (id: string, data: Partial<CreateServiceOrderDto>) =>
    apiClient.put<ServiceOrderResponse>(`/service-orders/${id}`, data),

  start: (id: string) =>
    apiClient.put<ServiceOrderResponse>(`/service-orders/${id}/start`),

  complete: (id: string) =>
    apiClient.put<ServiceOrderResponse>(`/service-orders/${id}/complete`),

  cancel: (id: string) =>
    apiClient.put<ServiceOrderResponse>(`/service-orders/${id}/cancel`),

  // Queries (Read Side)
  list: (companyId: string, page: number = 1, limit: number = 10) =>
    apiClient.get<PaginatedResponse<ServiceOrderResponse>>('/service-orders', {
      params: { companyId, page, limit },
    }),

  getById: (id: string) =>
    apiClient.get<ServiceOrderResponse>(`/service-orders/${id}`),

  search: (companyId: string, filters: SearchFilters) =>
    apiClient.post<PaginatedResponse<ServiceOrderResponse>>(
      '/service-orders/search',
      { companyId, ...filters }
    ),
}
```

---

## 🧩 Módulos e Features

### Organização por Módulos

Cada módulo representa um **Bounded Context** do backend:

1. **auth** - Autenticação e autorização
2. **organization** - Gestão de empresas (multi-tenant)
3. **service-orders** - Ordens de serviço
4. **financial** - Gestão financeira

### Estrutura de um Módulo Completo

```
modules/service-orders/
├── components/
│   ├── ServiceOrderForm.vue
│   ├── ServiceOrderCard.vue
│   ├── ServiceOrderTable.vue
│   └── ServiceOrderFilters.vue
│
├── views/
│   ├── ServiceOrdersView.vue        # Lista
│   ├── ServiceOrderDetailsView.vue  # Detalhes
│   └── ServiceOrderCreateView.vue   # Criação
│
├── stores/
│   ├── service-order.store.ts       # Store principal
│   └── service-order-query.store.ts # Store para queries (opcional)
│
├── composables/
│   ├── useServiceOrder.ts
│   ├── useServiceOrderForm.ts
│   └── useServiceOrderFilters.ts
│
├── types/
│   └── service-order.types.ts
│
└── router/
    └── service-order.routes.ts      # Rotas do módulo
```

---

## 🗄️ Gerenciamento de Estado

### Estratégia de Stores

#### 1. Stores por Módulo

Cada módulo tem sua própria store:

```typescript
// modules/service-orders/stores/service-order.store.ts
export const useServiceOrderStore = defineStore('serviceOrder', () => {
  // Estado específico do módulo
})
```

#### 2. Stores Globais

Stores compartilhadas em `shared/stores/`:

- `auth.store.ts` - Autenticação
- `company.store.ts` - Empresa atual (multi-tenant)
- `app.store.ts` - Estado global da aplicação

#### 3. Separação CQRS (Opcional)

Para módulos complexos, pode-se separar:

```typescript
// Write Side (Commands)
export const useServiceOrderCommandStore = defineStore('serviceOrderCommand', () => {
  // Operações de escrita: create, update, delete
})

// Read Side (Queries)
export const useServiceOrderQueryStore = defineStore('serviceOrderQuery', () => {
  // Operações de leitura: list, search, getById
})
```

### Composables vs Stores

**Use Stores quando:**
- Estado precisa ser compartilhado entre múltiplos componentes
- Estado precisa persistir entre navegações
- Lógica complexa de negócio

**Use Composables quando:**
- Lógica reutilizável mas sem estado global
- Helpers e utilitários
- Lógica específica de um componente

---

## 🌐 Comunicação com Backend

### API Client Centralizado

**`shared/api/client.ts`:**

```typescript
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/shared/stores/auth.store'

// Instância base do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor - Adiciona token
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor - Trata erros
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { apiClient }
```

### Tipos de API

**`shared/api/types.ts`:**

```typescript
// Response padrão paginado
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Response padrão de erro
export interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

// Response padrão de sucesso
export interface ApiResponse<T> {
  data: T
  message?: string
}
```

---

## 🏢 Multi-Tenancy no Frontend

### Contexto de Empresa

O frontend deve sempre trabalhar no contexto de uma empresa (tenant):

**`shared/stores/company.store.ts`:**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Company } from '@/shared/types/domain.types'

export const useCompanyStore = defineStore('company', () => {
  const currentCompany = ref<Company | null>(null)
  const companies = ref<Company[]>([])

  const companyId = computed(() => currentCompany.value?.id || null)
  const hasCompany = computed(() => currentCompany.value !== null)

  function setCurrentCompany(company: Company) {
    currentCompany.value = company
    // Persistir no localStorage
    localStorage.setItem('currentCompanyId', company.id)
  }

  function loadCurrentCompany() {
    const companyId = localStorage.getItem('currentCompanyId')
    if (companyId) {
      // Carregar empresa do backend
    }
  }

  return {
    currentCompany,
    companies,
    companyId,
    hasCompany,
    setCurrentCompany,
    loadCurrentCompany,
  }
})
```

### Uso em Componentes

```vue
<script setup lang="ts">
import { useCompanyStore } from '@/shared/stores/company.store'
import { useServiceOrderStore } from '@/modules/service-orders/stores/service-order.store'

const companyStore = useCompanyStore()
const serviceOrderStore = useServiceOrderStore()

// Sempre usar companyId nas requisições
onMounted(() => {
  if (companyStore.companyId) {
    serviceOrderStore.loadOrders(companyStore.companyId)
  }
})
</script>
```

### Seletor de Empresa

Componente para trocar de empresa:

```vue
<template>
  <select v-model="selectedCompanyId" @change="handleCompanyChange">
    <option v-for="company in companies" :key="company.id" :value="company.id">
      {{ company.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { useCompanyStore } from '@/shared/stores/company.store'

const companyStore = useCompanyStore()
const selectedCompanyId = ref(companyStore.companyId)

async function handleCompanyChange() {
  const company = companyStore.companies.find(
    (c) => c.id === selectedCompanyId.value
  )
  if (company) {
    await companyStore.setCurrentCompany(company)
    // Recarregar dados da nova empresa
    router.go(0) // Recarregar página
  }
}
</script>
```

---

## 🔐 Autenticação e Autorização

### Auth Store

**`shared/stores/auth.store.ts`:**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/shared/api/auth.api'
import type { User, LoginCredentials } from '@/shared/types/domain.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userRoles = computed(() => user.value?.roles || [])

  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const response = await authApi.login(credentials)
      token.value = response.data.token
      user.value = response.data.user
      
      // Persistir token
      localStorage.setItem('token', token.value)
      
      return response.data
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    // Limpar dados da empresa também
  }

  function hasRole(role: string): boolean {
    return userRoles.value.includes(role)
  }

  function hasPermission(permission: string): boolean {
    // Verificar permissão do usuário
    return user.value?.permissions?.includes(permission) || false
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userRoles,
    login,
    logout,
    hasRole,
    hasPermission,
  }
})
```

### Route Guards

**`shared/router/guards.ts`:**

```typescript
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useCompanyStore } from '@/shared/stores/company.store'

export function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

export function requireCompany(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const companyStore = useCompanyStore()
  
  if (!companyStore.hasCompany) {
    next({ name: 'CompanySelection' })
  } else {
    next()
  }
}

export function requireRole(role: string) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    
    if (!authStore.hasRole(role)) {
      next({ name: 'Forbidden' })
    } else {
      next()
    }
  }
}
```

### Uso nos Componentes

```vue
<template>
  <div v-if="canCreateOrder">
    <button @click="createOrder">Criar Ordem</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/shared/stores/auth.store'

const authStore = useAuthStore()

const canCreateOrder = computed(() => {
  return authStore.hasPermission('service-order:create')
})
</script>
```

---

## 🎨 Componentes e UI

### Componentes Reutilizáveis

Componentes básicos em `shared/components/ui/`:

#### Button.vue

```vue
<template>
  <button
    :class="['btn', `btn-${variant}`, `btn-${size}`, { 'btn-loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading">Carregando...</span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

### Layouts

**`shared/layouts/DashboardLayout.vue`:**

```vue
<template>
  <div class="dashboard-layout">
    <Header />
    <div class="dashboard-content">
      <Sidebar />
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/shared/components/layout/Header.vue'
import Sidebar from '@/shared/components/layout/Sidebar.vue'
</script>
```

---

## 🛣️ Roteamento

### Estrutura de Rotas

**`shared/router/index.ts`:**

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireCompany } from './guards'
import authRoutes from './routes/auth.routes'
import serviceOrderRoutes from './routes/service-order.routes'
import organizationRoutes from './routes/organization.routes'
import financialRoutes from './routes/financial.routes'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/auth/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    component: () => import('@/shared/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true, requiresCompany: true },
    beforeEnter: [requireAuth, requireCompany],
    children: [
      ...serviceOrderRoutes,
      ...organizationRoutes,
      ...financialRoutes,
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

### Rotas por Módulo

**`shared/router/routes/service-order.routes.ts`:**

```typescript
import type { RouteRecordRaw } from 'vue-router'

const serviceOrderRoutes: RouteRecordRaw[] = [
  {
    path: 'service-orders',
    name: 'ServiceOrders',
    component: () =>
      import('@/modules/service-orders/views/ServiceOrdersView.vue'),
    meta: {
      title: 'Ordens de Serviço',
      requiresPermission: 'service-order:view',
    },
  },
  {
    path: 'service-orders/create',
    name: 'ServiceOrderCreate',
    component: () =>
      import('@/modules/service-orders/views/ServiceOrderCreateView.vue'),
    meta: {
      title: 'Criar Ordem de Serviço',
      requiresPermission: 'service-order:create',
    },
  },
  {
    path: 'service-orders/:id',
    name: 'ServiceOrderDetails',
    component: () =>
      import('@/modules/service-orders/views/ServiceOrderDetailsView.vue'),
    meta: {
      title: 'Detalhes da Ordem de Serviço',
      requiresPermission: 'service-order:view',
    },
  },
]

export default serviceOrderRoutes
```

---

## 🧪 Testes

### Estrutura de Testes

```
frontend/
├── src/
└── tests/
    ├── unit/
    │   ├── components/
    │   ├── stores/
    │   └── utils/
    ├── integration/
    └── e2e/
```

### Exemplo: Teste de Store

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useServiceOrderStore } from '@/modules/service-orders/stores/service-order.store'

describe('ServiceOrderStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should load orders', async () => {
    const store = useServiceOrderStore()
    await store.loadOrders('company-1')
    
    expect(store.orders).toHaveLength(0)
    expect(store.loading).toBe(false)
  })
})
```

### Exemplo: Teste de Componente

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceOrderForm from '@/modules/service-orders/components/ServiceOrderForm.vue'

describe('ServiceOrderForm', () => {
  it('should render form', () => {
    const wrapper = mount(ServiceOrderForm, {
      props: {
        companyId: 'company-1',
      },
    })
    
    expect(wrapper.find('form').exists()).toBe(true)
  })
})
```

---

## ⚡ Performance e Otimização

### 1. Lazy Loading de Rotas

```typescript
{
  path: '/service-orders',
  component: () => import('@/modules/service-orders/views/ServiceOrdersView.vue'),
}
```

### 2. Code Splitting por Módulo

```typescript
// Vite automaticamente faz code splitting baseado em imports dinâmicos
const ServiceOrdersView = () => import('@/modules/service-orders/views/ServiceOrdersView.vue')
```

### 3. Virtual Scrolling para Listas Grandes

```vue
<template>
  <VirtualList
    :data-key="'id'"
    :data-sources="orders"
    :data-component="ServiceOrderCard"
  />
</template>
```

### 4. Debounce em Buscas

```typescript
import { debounce } from 'lodash-es'

const search = debounce(async (query: string) => {
  await serviceOrderStore.search(query)
}, 300)
```

### 5. Cache de Requisições

```typescript
// Usar cache no store
const cache = new Map<string, { data: any; timestamp: number }>()

async function loadOrders(companyId: string, forceRefresh = false) {
  const cacheKey = `orders-${companyId}`
  const cached = cache.get(cacheKey)
  
  if (!forceRefresh && cached && Date.now() - cached.timestamp < 60000) {
    orders.value = cached.data
    return
  }
  
  // Fazer requisição
  const response = await serviceOrderApi.list(companyId)
  cache.set(cacheKey, { data: response.data.data, timestamp: Date.now() })
  orders.value = response.data.data
}
```

---

## ✅ Boas Práticas

### 1. TypeScript

- ✅ Sempre definir tipos explícitos
- ✅ Usar interfaces para objetos
- ✅ Evitar `any` (usar `unknown` quando necessário)
- ✅ Usar type guards quando necessário

```typescript
// ❌ Ruim
function processOrder(order: any) {
  return order.id
}

// ✅ Bom
function processOrder(order: ServiceOrderResponse) {
  return order.id
}
```

### 2. Composables

- ✅ Um composable por responsabilidade
- ✅ Retornar objetos reativos
- ✅ Usar nomes descritivos

```typescript
// ✅ Bom
export function useServiceOrderForm() {
  const form = ref<CreateServiceOrderDto>({...})
  const errors = ref<Record<string, string>>({})
  
  function validate() {
    // Validação
  }
  
  return {
    form,
    errors,
    validate,
  }
}
```

### 3. Error Handling

```typescript
// ✅ Sempre tratar erros
async function loadOrders() {
  try {
    await serviceOrderStore.loadOrders(companyId.value)
  } catch (error: any) {
    // Mostrar toast de erro
    toast.error(error.message || 'Erro ao carregar ordens')
  }
}
```

### 4. Loading States

```vue
<template>
  <div v-if="loading">Carregando...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <!-- Conteúdo -->
  </div>
</template>
```

### 5. Validação de Formulários

```typescript
// Usar biblioteca de validação (Zod, Yup, etc.)
import { z } from 'zod'

const createOrderSchema = z.object({
  companyId: z.string().uuid(),
  description: z.string().min(10),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  value: z.number().min(0),
})

type CreateOrderForm = z.infer<typeof createOrderSchema>
```

---

## 📋 Checklist de Desenvolvimento

### Fase 0: Base Compartilhada ✅ IMPLEMENTADO

**Antes de Começar:**
- [x] Setup inicial do projeto (Vite + Vue 3 + TypeScript)
- [x] Configurar estrutura de pastas base
- [x] Configurar ESLint e Prettier

**Durante o Desenvolvimento:**
- [x] Criar API Client base (`shared/api/client.ts`)
- [x] Configurar interceptors (auth, errors)
- [x] Criar componentes UI base (Button, Input, Modal, Table)
- [x] Criar layouts base (DefaultLayout, AuthLayout, DashboardLayout)
- [x] Configurar Vue Router base
- [x] Criar stores globais base (app.store.ts)
- [x] Criar utilitários base (formatters, validators)

**Antes de Finalizar:**
- [x] Testar API Client com backend mockado
- [x] Verificar TypeScript (sem erros)
- [x] Executar linter

---

### Fase 1: Identity & Access ✅ IMPLEMENTADO

**Antes de Começar:**
- [x] Verificar se backend tem Controllers implementados
- [x] Revisar DTOs do backend (LoginCredentials, User, etc.)
- [x] Definir estrutura de pastas do módulo auth

**Durante o Desenvolvimento:**
- [x] Criar tipos TypeScript (`modules/auth/types/auth.types.ts`)
- [x] Criar API client (`modules/auth/api/auth.api.ts`)
- [x] Criar store Pinia (`shared/stores/auth.store.ts`)
- [x] Criar composable `useAuth.ts`
- [x] Criar componente `LoginForm.vue`
- [x] Criar view `LoginView.vue`
- [x] Adicionar rotas no router
- [x] Implementar route guards (requireAuth)
- [x] Integrar com API Client base (interceptors de token)

**Funcionalidades Adicionais:**
- [x] Criar componente `RegisterForm.vue`
- [x] Criar view `RegisterView.vue`
- [x] Criar view `PasswordResetView.vue`
- [x] Criar view `PasswordResetConfirmView.vue`
- [x] Implementar `updateProfile()` e `changePassword()`
- [x] Implementar verificação de roles e permissões

**Antes de Finalizar:**
- [x] Testar login/logout completo
- [x] Verificar persistência de token
- [x] Testar route guards
- [x] Verificar tratamento de erros
- [x] Testar com diferentes roles/permissões

---

### Fase 2: Organization (Multi-tenant) ✅ IMPLEMENTADO

**Antes de Começar:**
- [x] Verificar se backend tem Controllers de Company implementados
- [x] Revisar DTOs do backend (Company, etc.)
- [x] Verificar se auth está funcionando (necessário para multi-tenant)

**Durante o Desenvolvimento:**
- [x] Criar tipos TypeScript (`modules/organization/types/organization.types.ts`)
- [x] Criar API client (`modules/organization/api/organization.api.ts`)
- [x] Criar store global (`shared/stores/company.store.ts`) ⚠️ **Store Global**
- [x] Criar composable `useCompany.ts` (integrado no store)
- [x] Criar componente `CompanySwitcher.vue`
- [x] Criar view `CompanySelectionView.vue`
- [x] Adicionar rotas no router
- [x] Implementar route guard (requireCompany)
- [x] Integrar seletor de empresa em layout

**Funcionalidades Adicionais:**
- [x] Criar componente `CompanyForm.vue`
- [x] Criar view `CompaniesView.vue` (listagem e criação)
- [x] Criar view `CompanyDetailsView.vue`
- [x] Criar view `CompanySettingsView.vue` (placeholder)

**Antes de Finalizar:**
- [x] Testar seleção de empresa
- [x] Verificar persistência de empresa selecionada
- [x] Testar isolamento de dados por empresa
- [x] Verificar route guards
- [x] Testar troca de empresa

---

### Fase 3: Service Order (Core Domain) ✅ IMPLEMENTADO

**Antes de Começar:**
- [x] Verificar se backend tem Controllers (Write e Read) implementados
- [x] Revisar DTOs do backend (CreateServiceOrderDto, ServiceOrderResponse, etc.)
- [x] Verificar se Organization está funcionando (necessário para companyId)
- [x] Definir estrutura de pastas do módulo service-orders

**Durante o Desenvolvimento:**

**Write Side:**
- [x] Criar tipos TypeScript para Commands
- [x] Criar API client para Commands (create, update, start, complete, cancel)
- [x] Criar store de Commands OU adicionar ao store único
- [x] Criar componente `ServiceOrderForm.vue`
- [x] Criar componente `ServiceOrderActions.vue`
- [x] Criar view `ServiceOrderCreateView.vue`

**Read Side:**
- [x] Criar tipos TypeScript para Queries
- [x] Criar API client para Queries (list, getById, search)
- [x] Criar store de Queries OU adicionar ao store único
- [x] Criar componente `ServiceOrderCard.vue`
- [x] Criar componente `ServiceOrderTable.vue`
- [x] Criar componente `ServiceOrderFilters.vue`
- [x] Criar view `ServiceOrdersView.vue` (lista)
- [x] Criar view `ServiceOrderDetailsView.vue`

**Integração:**
- [x] Adicionar rotas no router
- [x] Implementar validações de formulário
- [x] Adicionar loading states
- [x] Implementar tratamento de erros
- [x] Adicionar paginação (se necessário)
- [x] Adicionar filtros e busca

**Composables:**
- [x] Criar `useServiceOrder.ts` (composable principal)
- [x] Criar `useServiceOrderForm.ts` (gerenciamento de formulário)
- [x] Criar `useServiceOrderFilters.ts` (gerenciamento de filtros)

**Views Adicionais:**
- [x] Criar `HomeView.vue` (dashboard com estatísticas)

**Antes de Finalizar:**
- [x] Testar criação de ordem de serviço
- [x] Testar listagem de ordens
- [x] Testar detalhes de ordem
- [x] Testar ações (start, complete, cancel)
- [x] Testar filtros e busca
- [x] Verificar isolamento por empresa
- [ ] Testar com diferentes roles/permissões (pendente testes manuais)
- [x] Verificar responsividade
- [ ] Adicionar testes unitários (pendente configuração de testes)

---

### Fase 4: Financial (Core Domain)

**Antes de Começar:**
- [ ] Verificar se backend tem Controllers implementados
- [ ] Revisar DTOs do backend
- [ ] Verificar se Service Order está funcionando (dependência)

**Durante o Desenvolvimento:**
- [ ] Seguir mesma estrutura de Service Order
- [ ] Criar tipos, API client, stores, components, views
- [ ] Integrar com Service Order (associação de transações)

**Antes de Finalizar:**
- [ ] Testar integração completa
- [ ] Verificar isolamento por empresa
- [ ] Testar com diferentes roles/permissões

---

### Checklist Geral (Aplicável a Todos os Módulos)

**Antes de Começar um Módulo:**
- [ ] Verificar dependências do backend (Controllers implementados?)
- [ ] Revisar documentação do backend (endpoints, DTOs)
- [ ] Verificar se módulos dependentes estão prontos
- [ ] Definir estrutura de pastas do módulo
- [ ] Alinhar tipos TypeScript com DTOs do backend

**Durante o Desenvolvimento:**
- [ ] Criar tipos TypeScript para o módulo
- [ ] Criar API client com todos os endpoints (Commands e Queries)
- [ ] Criar store Pinia com estado e ações
- [ ] Criar composables para lógica reutilizável
- [ ] Criar componentes Vue seguindo padrões
- [ ] Criar views/páginas
- [ ] Adicionar rotas no router
- [ ] Implementar tratamento de erros
- [ ] Adicionar loading states
- [ ] Implementar validações de formulário
- [ ] Adicionar testes unitários

**Antes de Finalizar:**
- [ ] Verificar TypeScript (sem erros)
- [ ] Executar linter (`npm run lint`)
- [ ] Testar integração completa com backend
- [ ] Testar em diferentes navegadores
- [ ] Verificar responsividade
- [ ] Verificar acessibilidade básica
- [ ] Testar com diferentes roles/permissões
- [ ] Testar multi-tenancy (trocar de empresa)
- [ ] Revisar código (code review)
- [ ] Atualizar documentação se necessário

---

## 🔧 Desenvolvimento com Mocks (Backend em Desenvolvimento)

Quando o backend ainda está em desenvolvimento, você pode usar mocks temporários para desenvolver o frontend em paralelo.

### Estratégia de Mocks

#### 1. Mock no API Client

```typescript
// modules/service-orders/api/service-order.api.ts
import { apiClient } from '@/shared/api/client'

// Flag para usar mocks (definir em .env)
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export const serviceOrderApi = {
  create: async (data: CreateServiceOrderDto) => {
    if (USE_MOCKS) {
      // Mock response
      return Promise.resolve({
        data: {
          id: crypto.randomUUID(),
          ...data,
          status: 'CREATED',
          createdAt: new Date().toISOString(),
        },
      })
    }
    return apiClient.post('/service-orders', data)
  },
  
  list: async (companyId: string, page: number = 1, limit: number = 10) => {
    if (USE_MOCKS) {
      // Mock response
      return Promise.resolve({
        data: {
          data: Array.from({ length: limit }, (_, i) => ({
            id: crypto.randomUUID(),
            companyId,
            description: `Mock Order ${i + 1}`,
            priority: 'MEDIUM',
            value: 100,
            status: 'CREATED',
            createdAt: new Date().toISOString(),
          })),
          total: 50,
          page,
          limit,
          totalPages: 5,
        },
      })
    }
    return apiClient.get('/service-orders', { params: { companyId, page, limit } })
  },
}
```

#### 2. Mock Server (MSW - Mock Service Worker)

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.post('/api/service-orders', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: crypto.randomUUID(),
        ...req.body,
        status: 'CREATED',
        createdAt: new Date().toISOString(),
      })
    )
  }),
  
  rest.get('/api/service-orders', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      })
    )
  }),
]
```

#### 3. Variáveis de Ambiente

```env
# .env.local
VITE_USE_MOCKS=true
VITE_API_URL=http://localhost:3000
```

### Quando Remover Mocks

- [ ] Backend Controllers implementados e testados
- [ ] Endpoints funcionando corretamente
- [ ] Integração completa testada
- [ ] Remover flag `USE_MOCKS`
- [ ] Remover código de mock
- [ ] Atualizar testes se necessário

---

## 🚀 Próximos Passos

1. **Configurar biblioteca de validação** (Zod ou Yup)
2. **Configurar testes** (Vitest + Vue Test Utils)
3. **Configurar Storybook** (para documentação de componentes)
4. **Configurar i18n** (internacionalização)
5. **Configurar tema** (dark mode, cores corporativas)
6. **Configurar CI/CD** para frontend
7. **Adicionar métricas** (analytics, performance)

---

**Última atualização:** 2026  
**Versão:** 1.0.0

