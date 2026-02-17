# ServiCore — Linguagem Ubíqua

> Glossário de termos do domínio usado consistentemente em todo o projeto

**Última atualização:** 2026
**Versão:** 1.0.0

---

## 📋 Índice

1. [Identity & Access](#identity--access)
2. [Organization](#organization)
3. [Service Order](#service-order)
4. [Financial](#financial)
5. [Termos Compartilhados](#termos-compartilhados)

---

## 🔐 Identity & Access

### User (Usuário)

**Definição:** Pessoa que possui acesso ao sistema através de credenciais (email e senha).

**Características:**
- Identificado unicamente por email
- Possui um ou mais roles
- Pode estar associado a uma ou mais empresas
- Possui sessões ativas

**Regras de Negócio:**
- Email deve ser único no sistema
- Senha deve seguir política de segurança
- Usuário pode ser ativo ou inativo

**Sinônimos a Evitar:** Account, AccountHolder, Person

---

### Role (Papel)

**Definição:** Conjunto de permissões que define o que um usuário pode fazer no sistema.

**Valores Possíveis:**
- `ADMIN`: Acesso total ao sistema
- `COMPANY_ADMIN`: Administrador de uma empresa específica
- `MANAGER`: Gerente com permissões de gestão
- `TECHNICIAN`: Técnico que executa serviços
- `CLIENT`: Cliente que solicita serviços

**Regras de Negócio:**
- Um usuário pode ter múltiplos roles
- Roles são hierárquicos (ADMIN > COMPANY_ADMIN > MANAGER > TECHNICIAN > CLIENT)
- Roles podem ser específicos por empresa

**Sinônimos a Evitar:** Permission, AccessLevel, Profile

---

### Permission (Permissão)

**Definição:** Ação específica que pode ser executada no sistema.

**Exemplos:**
- `service-order:create`
- `service-order:update`
- `service-order:delete`
- `financial:view`
- `financial:approve`

**Regras de Negócio:**
- Permissões são agrupadas em roles
- Permissões podem ser verificadas em tempo de execução
- Permissões são granulares (recurso:ação)

**Sinônimos a Evitar:** Right, Access, Capability

---

### Session (Sessão)

**Definição:** Período ativo de autenticação de um usuário no sistema.

**Características:**
- Identificada por um token JWT
- Possui data de expiração
- Pode ser invalidada manualmente
- Armazena informações do usuário e empresa atual

**Regras de Negócio:**
- Sessão expira após período de inatividade
- Usuário pode ter múltiplas sessões ativas
- Sessão é associada a um IP e User-Agent

**Sinônimos a Evitar:** Login, Authentication, Token

---

### Authentication (Autenticação)

**Definição:** Processo de verificação da identidade do usuário através de credenciais.

**Fluxo:**
1. Usuário fornece email e senha
2. Sistema valida credenciais
3. Sistema gera token JWT
4. Sistema cria sessão

**Sinônimos a Evitar:** Login, SignIn

---

### Authorization (Autorização)

**Definição:** Processo de verificação se um usuário autenticado possui permissão para executar uma ação.

**Sinônimos a Evitar:** Permission Check, Access Control

---

## 🏢 Organization

### Company (Empresa)

**Definição:** Organização ou cliente que utiliza o sistema de forma isolada (multi-tenant).

**Características:**
- Identificada por um ID único
- Possui nome, CNPJ, endereço
- Possui configurações próprias
- Isola dados de outras empresas

**Regras de Negócio:**
- CNPJ deve ser único
- Empresa pode estar ativa ou inativa
- Empresa possui plano de assinatura

**Sinônimos a Evitar:** Organization, Tenant, Client, Customer

---

### Tenant (Inquilino)

**Definição:** Conceito técnico que representa o isolamento de dados por empresa.

**Nota:** Em código, usamos "Company" como termo de negócio. "Tenant" é usado apenas em contexto técnico de multi-tenancy.

**Sinônimos a Evitar:** Company (em contexto técnico de isolamento)

---

### Department (Departamento)

**Definição:** Divisão organizacional dentro de uma empresa.

**Características:**
- Pertence a uma empresa
- Possui nome e descrição
- Pode ter hierarquia (departamento pai)
- Agrupa usuários e recursos

**Regras de Negócio:**
- Departamento pode ter sub-departamentos
- Usuários podem pertencer a múltiplos departamentos
- Departamentos podem ter orçamentos próprios

**Sinônimos a Evitar:** Division, Unit, Sector

---

### OrganizationSettings (Configurações Organizacionais)

**Definição:** Configurações específicas de uma empresa que afetam o comportamento do sistema.

**Exemplos:**
- Moeda padrão
- Fuso horário
- Formato de data
- Políticas de aprovação
- Limites de uso

**Sinônimos a Evitar:** CompanySettings, TenantConfig

---

## 📋 Service Order

### Service Order (Ordem de Serviço)

**Definição:** Entidade principal que representa um serviço a ser executado, em execução ou já finalizado.

**Características:**
- Identificada por um número único
- Pertence a uma empresa
- Possui descrição, prioridade, valor e status
- Pode ter histórico de alterações
- Pode ter responsáveis atribuídos

**Regras de Negócio:**
- Ordem de serviço passa por estados bem definidos
- Não pode retroceder de status (exceto cancelamento)
- Valor não pode ser negativo
- Deve ter pelo menos um responsável quando iniciada

**Sinônimos a Evitar:** Order, Service, Task, WorkOrder, OS

---

### Priority (Prioridade)

**Definição:** Valor que indica a urgência de uma ordem de serviço.

**Valores Possíveis:**
- `LOW`: Baixa prioridade
- `MEDIUM`: Prioridade média
- `HIGH`: Alta prioridade
- `CRITICAL`: Prioridade crítica

**Regras de Negócio:**
- Prioridade afeta ordem de exibição
- Prioridade pode ser alterada durante o ciclo de vida
- Ordens críticas geram notificações imediatas

**Sinônimos a Evitar:** Urgency, Importance, Level

---

### Status (Status)

**Definição:** Estado atual de uma ordem de serviço no seu ciclo de vida.

**Valores Possíveis:**
- `CREATED`: Criada mas não iniciada
- `STARTED`: Iniciada e em preparação
- `IN_PROGRESS`: Em execução
- `PAUSED`: Pausada temporariamente
- `COMPLETED`: Finalizada com sucesso
- `CANCELLED`: Cancelada
- `REJECTED`: Rejeitada

**Regras de Negócio:**
- Transições de status seguem máquina de estados
- Status não pode retroceder (exceto cancelamento)
- Cada mudança de status gera evento de domínio

**Fluxo de Estados:**
```
CREATED → STARTED → IN_PROGRESS → COMPLETED
   ↓         ↓           ↓
CANCELLED  PAUSED    REJECTED
```

**Sinônimos a Evitar:** State, Stage, Phase

---

### Money (Valor)

**Definição:** Montante financeiro associado a uma ordem de serviço.

**Características:**
- Representado como decimal com 2 casas decimais
- Possui moeda (padrão: BRL)
- Não pode ser negativo
- Pode ser zero (serviço gratuito)

**Regras de Negócio:**
- Valor pode ser alterado antes de iniciar
- Após iniciar, alterações requerem aprovação
- Valor final pode diferir do valor inicial (ajustes)

**Sinônimos a Evitar:** Amount, Price, Cost, Value

---

### Assignment (Atribuição)

**Definição:** Associação de um responsável (usuário) a uma ordem de serviço.

**Características:**
- Uma ordem pode ter múltiplos responsáveis
- Possui data de atribuição
- Pode ter tipo (principal, auxiliar, observador)

**Regras de Negócio:**
- Ordem deve ter pelo menos um responsável principal
- Responsáveis devem pertencer à mesma empresa
- Atribuição pode ser transferida

**Sinônimos a Evitar:** Assignee, Responsible, Owner

---

### History (Histórico)

**Definição:** Registro de todas as alterações ocorridas em uma ordem de serviço.

**Características:**
- Registra quem fez a alteração
- Registra quando foi feita
- Registra o que foi alterado (campo, valor antigo, valor novo)
- Imutável (append-only)

**Regras de Negócio:**
- Histórico não pode ser deletado
- Histórico é consultável mas não editável
- Cada mudança de status gera entrada no histórico

**Sinônimos a Evitar:** Log, Audit, ChangeLog, Timeline

---

## 💰 Financial

### Transaction (Transação)

**Definição:** Movimentação financeira que representa uma entrada ou saída de recursos.

**Características:**
- Identificada por um ID único
- Possui tipo (entrada/saída)
- Possui valor e moeda
- Associada a uma ordem de serviço (opcional)
- Possui data de ocorrência e data de registro

**Regras de Negócio:**
- Transação não pode ser deletada (apenas estornada)
- Transação deve ter saldo suficiente
- Transação requer aprovação se valor exceder limite

**Sinônimos a Evitar:** Movement, Entry, Record

---

### Payment (Pagamento)

**Definição:** Transação específica que representa o recebimento de um valor.

**Características:**
- Tipo de transação de entrada
- Associada a uma ordem de serviço
- Possui método de pagamento
- Possui status (pendente, processado, falhado)

**Métodos de Pagamento:**
- `CASH`: Dinheiro
- `PIX`: Transferência instantânea
- `CREDIT_CARD`: Cartão de crédito
- `DEBIT_CARD`: Cartão de débito
- `BANK_TRANSFER`: Transferência bancária
- `CHECK`: Cheque

**Regras de Negócio:**
- Pagamento deve ser associado a ordem de serviço
- Pagamento processado atualiza saldo automaticamente
- Pagamento falhado pode ser reprocessado

**Sinônimos a Evitar:** Receipt, Receiving, Collection

---

### Invoice (Fatura)

**Definição:** Documento fiscal que representa uma cobrança formal.

**Características:**
- Possui número único (NFe)
- Associada a uma ou mais ordens de serviço
- Possui valor total e impostos
- Possui status (rascunho, emitida, cancelada)

**Regras de Negócio:**
- Fatura pode ser emitida para múltiplas ordens
- Fatura emitida não pode ser alterada (apenas cancelada)
- Fatura requer dados fiscais completos

**Sinônimos a Evitar:** Bill, Receipt, TaxDocument

---

### Receivable (Conta a Receber)

**Definição:** Valor que a empresa tem direito de receber de um cliente.

**Características:**
- Associada a uma ordem de serviço
- Possui data de vencimento
- Possui status (aberta, recebida, vencida, cancelada)

**Regras de Negócio:**
- Conta a receber é criada quando ordem é finalizada
- Vencimento pode ser configurado por empresa
- Conta vencida gera alertas

**Sinônimos a Evitar:** AccountReceivable, AR, ToReceive

---

### Payable (Conta a Pagar)

**Definição:** Valor que a empresa deve pagar a um fornecedor ou prestador.

**Características:**
- Associada a uma ordem de serviço (opcional)
- Possui fornecedor/prestador
- Possui data de vencimento
- Possui status (aberta, paga, vencida, cancelada)

**Regras de Negócio:**
- Conta a pagar pode ser criada manualmente ou automaticamente
- Pagamento requer aprovação se valor exceder limite
- Conta vencida gera alertas

**Sinônimos a Evitar:** AccountPayable, AP, ToPay

---

### Balance (Saldo)

**Definição:** Valor total disponível ou devido de uma empresa.

**Características:**
- Calculado a partir de transações
- Possui saldo disponível e saldo bloqueado
- Atualizado em tempo real
- Histórico de saldos pode ser consultado

**Regras de Negócio:**
- Saldo não pode ficar negativo (sem limite de crédito)
- Saldo bloqueado não pode ser usado
- Saldo é recalculado a cada transação

**Sinônimos a Evitar:** AccountBalance, Total, Amount

---

## 🔄 Termos Compartilhados

### ID (Identificador)

**Definição:** Valor único que identifica uma entidade no sistema.

**Formato:** UUID v4

**Regras:**
- Gerado automaticamente
- Imutável
- Nunca reutilizado

---

### CreatedAt (Data de Criação)

**Definição:** Data e hora em que uma entidade foi criada no sistema.

**Formato:** ISO 8601 (UTC)

**Regras:**
- Definida automaticamente na criação
- Imutável

---

### UpdatedAt (Data de Atualização)

**Definição:** Data e hora da última atualização de uma entidade.

**Formato:** ISO 8601 (UTC)

**Regras:**
- Atualizada automaticamente a cada modificação
- Sempre maior ou igual a CreatedAt

---

### Active (Ativo)

**Definição:** Indica se uma entidade está ativa e disponível para uso.

**Valores:** `true` ou `false`

**Regras:**
- Entidades inativas não aparecem em consultas padrão
- Entidades inativas podem ser reativadas
- Deleção lógica usa `active = false`

---

### Domain Event (Evento de Domínio)

**Definição:** Evento que representa algo significativo que aconteceu no domínio.

**Características:**
- Imutável
- Possui timestamp
- Possui ID único
- Contém dados relevantes do evento

**Nomenclatura:**
- Formato: `{Entity}{Action}Event`
- Exemplos: `ServiceOrderCreatedEvent`, `PaymentProcessedEvent`

---

## 📝 Convenções de Nomenclatura

### Entidades
- **Singular e PascalCase**: `ServiceOrder`, `User`, `Company`
- **Em português no código**: Usar termos em inglês no código, documentação em português

### Value Objects
- **PascalCase**: `Priority`, `Money`, `ServiceOrderId`
- **Sufixo opcional**: `Id`, `Value`, `Status`

### Domain Events
- **PascalCase com sufixo Event**: `ServiceOrderCreatedEvent`
- **Verbo no passado**: Created, Updated, Deleted, Completed

### Use Cases
- **PascalCase com sufixo UseCase**: `CreateServiceOrderUseCase`
- **Verbo no infinitivo**: Create, Update, Delete, Get

### Repositories
- **PascalCase com sufixo Repository**: `ServiceOrderRepository`
- **Interface no domínio, implementação na infraestrutura**

---

## ⚠️ Termos a Evitar

### Evitar no Código
- ❌ `Order` → ✅ `ServiceOrder`
- ❌ `Account` → ✅ `User` ou `Company`
- ❌ `Task` → ✅ `ServiceOrder`
- ❌ `Customer` → ✅ `Company` (quando se refere à empresa cliente)
- ❌ `Client` → ✅ `Company` ou `User`
- ❌ `Login` → ✅ `Authentication` ou `Session`
- ❌ `Logout` → ✅ `SessionEnded` ou `SignOut`

### Evitar na Documentação
- Termos técnicos genéricos sem contexto de domínio
- Jargão de framework sem tradução para domínio
- Abreviações não padronizadas

---

**Próximos Passos:**
1. Revisar este documento com Domain Experts
2. Adicionar termos conforme novos contextos são identificados
3. Manter consistência em código e documentação
4. Atualizar quando novos conceitos emergirem

