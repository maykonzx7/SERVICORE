# Camada de Domínio - Templates e Guias

> Templates e exemplos para desenvolvimento do domínio seguindo DDD

## 📋 Estrutura

```
shared/domain/
├── base-entity.ts              # Classe base para entidades
├── aggregate-root.ts           # Classe base para aggregate roots
├── value-object.ts             # Classe base para value objects
├── domain-event.ts             # Classe base para eventos de domínio
├── README.md                    # Este arquivo
└── templates/                   # Templates e exemplos
    └── README.md                # Guia completo com exemplos de código
```

---

## 🎯 Ordem de Implementação

Seguindo a Fase 3 do DEVELOPMENT_PROCESS.md:

### 1. Value Objects (Primeiro)

**Ordem sugerida:**
1. Value Objects simples (IDs, tipos primitivos)
2. Value Objects complexos (Money, Email, Address)
3. Value Objects compostos

**Templates disponíveis:**
Consulte `templates/README.md` para exemplos completos de:
- Value Objects (ID, Email, Money)
- Aggregate Roots
- Domain Events
- Repository Interfaces

---

## 📝 Como Usar os Templates

### Criar um Value Object de ID

1. Copie `value-object-id.template.ts`
2. Renomeie para `{entity-name}-id.ts`
3. Substitua `{EntityName}` pelo nome da entidade
4. Ajuste validações se necessário

**Exemplo:**
```typescript
// service-order-id.ts
export class ServiceOrderId extends ValueObject {
  // ... código do template adaptado
}
```

### Criar um Aggregate Root

1. Copie `aggregate-root.template.ts`
2. Renomeie para `{entity-name}.ts`
3. Substitua `{EntityName}` pelo nome da entidade
4. Adicione propriedades e métodos de negócio
5. Implemente factory methods (`create`, `reconstitute`)

**Exemplo:**
```typescript
// service-order.ts
export class ServiceOrder extends AggregateRoot {
  static create(...): ServiceOrder {
    // Lógica de criação
  }
  
  start(): void {
    // Método de negócio
  }
}
```

### Criar um Domain Event

1. Copie `domain-event.template.ts`
2. Renomeie para `{entity-name}-{action}.event.ts`
3. Substitua `{EntityName}` e `{Action}`
4. Adicione propriedades específicas do evento

**Exemplo:**
```typescript
// service-order-created.event.ts
export class ServiceOrderCreatedEvent extends DomainEvent {
  constructor(
    public readonly serviceOrderId: string,
    public readonly companyId: string
  ) {
    super();
  }
  
  get eventName(): string {
    return "ServiceOrderCreated";
  }
}
```

### Criar uma Repository Interface

1. Copie `repository-interface.template.ts`
2. Renomeie para `{entity-name}.repository.ts`
3. Substitua `{EntityName}`
4. Adicione métodos específicos se necessário

**Exemplo:**
```typescript
// service-order.repository.ts
export interface ServiceOrderRepository {
  save(order: ServiceOrder): Promise<void>;
  findById(id: ServiceOrderId): Promise<ServiceOrder | null>;
  // ...
}
```

---

## ✅ Boas Práticas

### Value Objects

1. **Sempre imutáveis** - Não permita alteração após criação
2. **Validação no construtor** - Valide no momento da criação
3. **Factory methods** - Use `create()` e `generate()` quando apropriado
4. **Equals method** - Implemente comparação correta

### Aggregate Roots

1. **Factory methods** - Use `create()` para criação, `reconstitute()` para reconstrução
2. **Encapsulamento** - Propriedades privadas, acesso via getters
3. **Invariantes** - Valide regras de negócio em métodos
4. **Domain Events** - Publique eventos quando algo significativo acontecer
5. **Métodos de negócio** - Represente ações do domínio, não apenas getters/setters

### Domain Events

1. **Imutáveis** - Eventos não podem ser alterados após criação
2. **Nomes descritivos** - Use `{Entity}{Action}Event`
3. **Propriedades relevantes** - Inclua apenas dados necessários
4. **Serialização** - Implemente `toJSON()` se necessário

### Repository Interfaces

1. **Apenas Aggregate Roots** - Repositories trabalham com aggregates
2. **Interface no domínio** - Implementação na infraestrutura
3. **Métodos específicos** - Adicione métodos de busca específicos quando necessário
4. **Async** - Todos os métodos devem ser assíncronos

---

## 🎯 Exemplo Completo: ServiceOrder

### 1. Value Objects

```typescript
// value-objects/service-order-id.ts
export class ServiceOrderId extends ValueObject { ... }

// value-objects/priority.ts
export class Priority extends ValueObject { ... }

// value-objects/money.ts
export class Money extends ValueObject { ... }
```

### 2. Aggregate Root

```typescript
// entities/service-order.ts
export class ServiceOrder extends AggregateRoot {
  static create(...): ServiceOrder { ... }
  start(): void { ... }
  complete(): void { ... }
}
```

### 3. Domain Events

```typescript
// events/service-order-created.event.ts
export class ServiceOrderCreatedEvent extends DomainEvent { ... }

// events/service-order-started.event.ts
export class ServiceOrderStartedEvent extends DomainEvent { ... }
```

### 4. Repository Interface

```typescript
// repositories/service-order.repository.ts
export interface ServiceOrderRepository {
  save(order: ServiceOrder): Promise<void>;
  findById(id: ServiceOrderId): Promise<ServiceOrder | null>;
}
```

---

## 📚 Referências

- **DEVELOPMENT_PROCESS.md** - Fase 3: Desenvolvimento do Domínio
- **AGGREGATES.md** - Identificação de Aggregates por contexto
- **UBIQUITOUS_LANGUAGE.md** - Linguagem ubíqua do domínio

---

## ⚠️ Regras Importantes

1. **Domínio não importa framework** - Não use decoradores do NestJS no domínio
2. **Domínio não importa Prisma** - Não use tipos do Prisma no domínio
3. **Domínio não conhece banco** - Não tenha referências a SQL, tabelas, etc.
4. **Validações no domínio** - Regras de negócio devem estar no domínio
5. **Imutabilidade** - Value Objects e Events são imutáveis

---

**Nota:** Estes templates são apenas guias. Adapte conforme as necessidades específicas de cada módulo.

