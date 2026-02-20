# 🔄 Criação Automática de Transação ao Criar Ordem de Serviço

## ✅ Implementado

Quando uma **Ordem de Serviço** é criada, o sistema **automaticamente cria uma transação financeira de receita (INCOME)** associada à ordem.

---

## 🏗️ Arquitetura

### Fluxo de Execução

```
1. POST /service-orders (CreateServiceOrderUseCase)
   ↓
2. ServiceOrder.create() → Gera ServiceOrderCreatedEvent
   ↓
3. Repository.save() → Persiste a ordem
   ↓
4. Use Case processa eventos de domínio
   ↓
5. ServiceOrderCreatedHandler.handle() → Cria transação automaticamente
   ↓
6. Transação criada com:
   - Tipo: INCOME (Receita)
   - Valor: Mesmo valor da ordem de serviço
   - Status: PENDING
   - Associada à ordem de serviço
```

---

## 📁 Arquivos Criados/Modificados

### 1. Event Handler
**`backend/src/modules/financial/application/event-handlers/service-order-created.handler.ts`**

- Handler que processa o evento `ServiceOrderCreatedEvent`
- Cria automaticamente uma transação de receita
- Associa a transação à ordem de serviço
- Tratamento de erros que não interrompe o fluxo de criação da ordem

### 2. Use Case Modificado
**`backend/src/modules/service-order/application/use-cases/create-service-order.usecase.ts`**

- Injeção opcional do `ServiceOrderCreatedHandler`
- Processa eventos de domínio após salvar a ordem
- Chama o handler para criar a transação

### 3. Módulos Configurados

**`backend/src/modules/financial/financial.module.ts`**
- Exporta `ServiceOrderCreatedHandler` como provider

**`backend/src/modules/service-order/service-order.module.ts`**
- Importa `FinancialModule`
- Injeta o handler opcionalmente no `CreateServiceOrderUseCase`

---

## 🎯 Comportamento

### Quando uma Ordem de Serviço é Criada:

1. **Ordem de Serviço** é criada normalmente
2. **Transação Financeira** é criada automaticamente com:
   - **Tipo:** `INCOME` (Receita)
   - **Valor:** Mesmo valor da ordem de serviço
   - **Status:** `PENDING` (Pendente)
   - **Descrição:** `"Receita referente à ordem de serviço #[ID]"`
   - **Associação:** `serviceOrderId` preenchido
   - **Moeda:** `BRL`
   - **Método de Pagamento:** `null` (será definido quando processar)
   - **Data de Vencimento:** `null` (será definido quando processar)

### Exemplo:

```json
// POST /service-orders
{
  "companyId": "5507ee12-d34e-451f-b055-e2385e32891b",
  "description": "Manutenção de ar condicionado",
  "priority": "HIGH",
  "value": 500.00
}

// Resultado:
// 1. Ordem de serviço criada
// 2. Transação criada automaticamente:
{
  "type": "INCOME",
  "amount": 500.00,
  "status": "PENDING",
  "serviceOrderId": "[id-da-ordem]",
  "description": "Receita referente à ordem de serviço #dba93096"
}
```

---

## 🔒 Tratamento de Erros

- Se a criação da transação falhar, **não interrompe** a criação da ordem
- Erro é logado no console
- Ordem de serviço é criada normalmente mesmo se a transação falhar

---

## 🔄 Próximos Passos

A transação criada automaticamente:
- ✅ Está com status `PENDING`
- ✅ Precisa ser **aprovada** (`PUT /transactions/:id/approve`)
- ✅ Depois **processada** (`PUT /transactions/:id/process`) para afetar o saldo

---

## 📝 Notas Técnicas

- **Injeção Opcional:** O handler é injetado opcionalmente para não quebrar se o módulo Financial não estiver disponível
- **Domain Events:** Usa o padrão de Domain Events para desacoplar módulos
- **Separação de Responsabilidades:** O módulo Service Order não conhece detalhes do módulo Financial, apenas chama o handler via evento

---

## ✅ Status

**Implementação completa e funcional!**

Agora, toda vez que uma ordem de serviço for criada, uma transação financeira será criada automaticamente.

