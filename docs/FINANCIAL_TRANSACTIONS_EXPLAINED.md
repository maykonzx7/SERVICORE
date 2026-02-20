# 💰 Transações Financeiras - Como Funciona

## 📋 Visão Geral

As **Transações Financeiras** são movimentações financeiras que representam entradas (receitas) ou saídas (despesas) de recursos da empresa. Elas são o núcleo do módulo financeiro do ServiCore.

---

## 🎯 Conceitos Principais

### 1. **Transaction (Transação)**

Uma transação financeira representa uma movimentação de dinheiro na empresa.

**Características:**
- ✅ Identificada por um ID único
- ✅ Pertence a uma empresa (multi-tenant)
- ✅ Pode estar associada a uma Ordem de Serviço (opcional)
- ✅ Possui tipo (Receita ou Despesa)
- ✅ Possui valor e moeda (padrão: BRL)
- ✅ Possui status (Pendente, Aprovada, Rejeitada, Processada, Cancelada)
- ✅ Possui método de pagamento (quando aplicável)
- ✅ Possui data de vencimento (quando aplicável)
- ✅ Possui histórico de aprovações/rejeições

---

## 📊 Tipos de Transações

### **INCOME (Receita)**
- Representa **entrada de dinheiro**
- Exemplos:
  - Pagamento de cliente por ordem de serviço
  - Recebimento de fatura
  - Venda de produto/serviço
  - Reembolso

### **EXPENSE (Despesa)**
- Representa **saída de dinheiro**
- Exemplos:
  - Pagamento a fornecedor
  - Compra de material
  - Salários
  - Aluguel
  - Despesas operacionais

---

## 🔄 Status e Fluxo de Trabalho

### **Máquina de Estados:**

```
PENDING (Pendente)
  ├─→ APPROVED (Aprovada)
  │     └─→ PROCESSED (Processada) ✅
  ├─→ REJECTED (Rejeitada) ❌
  └─→ CANCELLED (Cancelada) 🚫
```

### **Status Detalhados:**

1. **PENDING** (Pendente)
   - Transação criada, aguardando aprovação
   - Não afeta o saldo ainda
   - Pode ser editada

2. **APPROVED** (Aprovada)
   - Transação aprovada por um responsável
   - Pronta para ser processada
   - Não afeta o saldo ainda

3. **PROCESSED** (Processada)
   - Transação efetivamente realizada
   - **Agora afeta o saldo da empresa**
   - Não pode mais ser editada (apenas estornada)

4. **REJECTED** (Rejeitada)
   - Transação rejeitada por um responsável
   - Não afeta o saldo
   - Pode ter motivo de rejeição

5. **CANCELLED** (Cancelada)
   - Transação cancelada antes de ser processada
   - Não afeta o saldo
   - Pode ser cancelada pelo criador ou administrador

---

## 💳 Métodos de Pagamento

As transações podem ter os seguintes métodos de pagamento:

- **CASH** - Dinheiro
- **PIX** - Transferência instantânea
- **CREDIT_CARD** - Cartão de crédito
- **DEBIT_CARD** - Cartão de débito
- **BANK_TRANSFER** - Transferência bancária
- **CHECK** - Cheque
- **OTHER** - Outro método

---

## 🔗 Relacionamento com Ordens de Serviço

Uma transação pode estar **opcionalmente** associada a uma Ordem de Serviço:

- **Quando associada:**
  - Facilita rastreamento financeiro por ordem
  - Permite ver todas as transações de uma ordem
  - Facilita fechamento financeiro de ordens

- **Quando não associada:**
  - Transações gerais da empresa
  - Despesas operacionais
  - Receitas não relacionadas a ordens específicas

---

## 📝 Funcionalidades Disponíveis

### **1. Criar Transação**
- Definir tipo (Receita/Despesa)
- Informar valor e moeda
- Adicionar descrição
- Associar a ordem de serviço (opcional)
- Definir método de pagamento (opcional)
- Definir data de vencimento (opcional)

### **2. Editar Transação**
- Apenas enquanto estiver **PENDING**
- Alterar valor, descrição, método de pagamento, data de vencimento

### **3. Aprovar Transação**
- Aprovar transações pendentes
- Requer permissão `transaction:approve`
- Registra quem aprovou e quando

### **4. Rejeitar Transação**
- Rejeitar transações pendentes
- Adicionar motivo da rejeição
- Requer permissão `transaction:reject`

### **5. Processar Transação**
- Marcar como processada (efetivamente realizada)
- **A partir daqui, afeta o saldo da empresa**
- Requer permissão `transaction:process`

### **6. Cancelar Transação**
- Cancelar antes de ser processada
- Não afeta o saldo
- Pode ser feito pelo criador ou administrador

### **7. Buscar e Filtrar**
- Filtrar por tipo (Receita/Despesa)
- Filtrar por status
- Filtrar por método de pagamento
- Filtrar por período (data início/fim)
- Filtrar por ordem de serviço
- Busca por descrição

### **8. Visualizar Detalhes**
- Ver todas as informações da transação
- Ver histórico de aprovações/rejeições
- Ver ordem de serviço associada (se houver)
- Ver quem criou, aprovou, processou

---

## 💰 Saldo e Resumo Financeiro

### **Balance (Saldo)**
- **Total de Receitas** (INCOME processadas)
- **Total de Despesas** (EXPENSE processadas)
- **Saldo** = Receitas - Despesas
- Pode ser calculado para um período específico

### **Financial Summary (Resumo Financeiro)**
- Receitas totais do período
- Despesas totais do período
- Saldo líquido (receitas - despesas)
- Receitas pendentes (não processadas)
- Despesas pendentes (não processadas)
- Quantidade de transações

---

## 🔐 Controle de Acesso

### **Permissões Necessárias:**

- `transaction:view` - Ver transações
- `transaction:create` - Criar transações
- `transaction:update` - Editar transações
- `transaction:approve` - Aprovar transações
- `transaction:reject` - Rejeitar transações
- `transaction:process` - Processar transações
- `transaction:cancel` - Cancelar transações

---

## 📱 Interface do Usuário

### **Tela de Listagem (`/transactions`)**
- Lista todas as transações da empresa
- Filtros por tipo, status, período, método de pagamento
- Visualização em tabela ou cards
- Paginação
- Ações rápidas (aprovar, rejeitar, processar)

### **Tela de Detalhes (`/transactions/:id`)**
- Informações completas da transação
- Histórico de alterações
- Ações disponíveis (baseadas em status e permissões)
- Ordem de serviço associada (se houver)

### **Tela de Criação (`/transactions/create`)**
- Formulário para criar nova transação
- Campos: tipo, valor, descrição, método de pagamento, data de vencimento
- Opção de associar a ordem de serviço

### **Dashboard Financeiro (`/financial/dashboard`)**
- KPIs principais (receitas, despesas, saldo)
- Gráficos e visualizações
- Contas a receber/pagar
- Resumo financeiro

---

## 🔄 Fluxo Típico de Uso

### **Cenário 1: Recebimento de Pagamento de Cliente**

1. **Criar Transação** (Tipo: INCOME)
   - Valor: R$ 1.000,00
   - Descrição: "Pagamento OS #12345"
   - Método: PIX
   - Associar à Ordem de Serviço #12345
   - Status: PENDING

2. **Aprovar Transação**
   - Responsável financeiro aprova
   - Status: APPROVED

3. **Processar Transação**
   - Após confirmação do recebimento
   - Status: PROCESSED
   - **Saldo da empresa aumenta em R$ 1.000,00**

### **Cenário 2: Pagamento a Fornecedor**

1. **Criar Transação** (Tipo: EXPENSE)
   - Valor: R$ 500,00
   - Descrição: "Compra de material"
   - Método: BANK_TRANSFER
   - Data de vencimento: 30 dias
   - Status: PENDING

2. **Aprovar Transação**
   - Gerente aprova
   - Status: APPROVED

3. **Processar Transação**
   - Após efetuar o pagamento
   - Status: PROCESSED
   - **Saldo da empresa diminui em R$ 500,00**

### **Cenário 3: Rejeição de Transação**

1. **Criar Transação** (Tipo: EXPENSE)
   - Valor: R$ 10.000,00
   - Status: PENDING

2. **Rejeitar Transação**
   - Gerente rejeita
   - Motivo: "Valor acima do limite aprovado"
   - Status: REJECTED
   - **Não afeta o saldo**

---

## 🎯 Regras de Negócio Importantes

1. **Valor não pode ser negativo**
   - Transações sempre têm valores positivos
   - O tipo (INCOME/EXPENSE) define se aumenta ou diminui o saldo

2. **Apenas transações PROCESSED afetam o saldo**
   - Transações PENDING, APPROVED, REJECTED ou CANCELLED não alteram o saldo

3. **Transações processadas não podem ser editadas**
   - Apenas podem ser estornadas (criando transação reversa)

4. **Transações devem pertencer a uma empresa**
   - Isolamento multi-tenant garantido

5. **Aprovação pode ser obrigatória**
   - Dependendo do valor ou configurações da empresa
   - Transações acima de um limite podem requerer aprovação

---

## 📊 Relatórios e Análises

### **Disponíveis:**
- Saldo atual da empresa
- Receitas vs Despesas por período
- Transações pendentes
- Contas a receber (com data de vencimento)
- Contas a pagar (com data de vencimento)
- Histórico de transações

### **Futuro:**
- Gráficos de tendências
- Projeções financeiras
- Análise por categoria
- Exportação para Excel/PDF
- Integração com sistemas contábeis

---

## 🔗 Integração com Outros Módulos

### **Service Order (Ordens de Serviço)**
- Transações podem ser associadas a ordens
- Facilita fechamento financeiro de ordens
- Permite rastrear receitas por ordem

### **Organization (Empresas)**
- Cada transação pertence a uma empresa
- Saldos são calculados por empresa
- Isolamento completo entre empresas

---

## ✅ Resumo

As **Transações Financeiras** são o sistema de controle financeiro do ServiCore, permitindo:

- ✅ Registrar todas as movimentações financeiras
- ✅ Controlar aprovações e processamentos
- ✅ Calcular saldos e resumos
- ✅ Rastrear receitas e despesas
- ✅ Associar transações a ordens de serviço
- ✅ Gerar relatórios e análises

Tudo isso com **controle de acesso**, **auditoria completa** e **isolamento multi-tenant**.

