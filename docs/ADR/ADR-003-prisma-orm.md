# ADR-003: Prisma ORM

## Status
Aceito

## Contexto
O ServiCore precisa de uma solução para:
- Gerenciar schema do banco de dados de forma versionada
- Gerar tipos TypeScript a partir do schema
- Facilitar migrações de banco de dados
- Prover type-safety nas consultas ao banco
- Suportar PostgreSQL como banco de dados principal

## Decisão
Adotamos **Prisma** como ORM principal do projeto.

### Razões da Escolha

1. **Type Safety**
   - Gera tipos TypeScript automaticamente a partir do schema
   - Reduz erros em tempo de compilação
   - Autocomplete completo no IDE

2. **Migrações Versionadas**
   - Migrações são arquivos SQL versionados
   - Histórico completo de mudanças no schema
   - Facilita rollback e colaboração em equipe

3. **Developer Experience**
   - Prisma Studio para visualização de dados
   - CLI poderoso para gerenciar schema e migrações
   - Documentação excelente

4. **Performance**
   - Query builder eficiente
   - Suporte a transações
   - Preparado para escalar

5. **Compatibilidade com Arquitetura Hexagonal**
   - Prisma Client é usado apenas na camada de Infrastructure
   - Não "vaza" para o domínio
   - Facilita criação de mappers (Domain ↔ Persistence)

## Implementação

### Schema Definition
```prisma
// prisma/schema.prisma
model ServiceOrder {
  id          String   @id @default(uuid())
  companyId   String
  description String
  priority    String
  value       Decimal  @db.Decimal(10, 2)
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([companyId])
  @@index([status])
}
```

### Uso na Infrastructure
```typescript
// PrismaService (singleton compartilhado)
@Injectable()
export class PrismaService extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }
}

// Repository Implementation
@Injectable()
export class PrismaServiceOrderRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  async save(order: ServiceOrder): Promise<void> {
    const data = ServiceOrderMapper.toPersistence(order);
    await this.prisma.serviceOrder.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}
```

### Migrações
```bash
# Criar migração
npx prisma migrate dev --name create_service_order

# Aplicar migrações em produção
npx prisma migrate deploy
```

## Consequências

### Positivas
- ✅ Type safety em todas as operações de banco
- ✅ Migrações versionadas e seguras
- ✅ Schema como código (versionado no Git)
- ✅ Ferramentas de desenvolvimento (Prisma Studio)
- ✅ Boa performance e suporte a transações

### Negativas
- ⚠️ Curva de aprendizado inicial
- ⚠️ Necessidade de regenerar Prisma Client após mudanças no schema
- ⚠️ Algumas limitações em queries muito complexas (mas raro)

## Alternativas Consideradas

### TypeORM
- ❌ Menos type safety
- ❌ Migrações menos robustas
- ❌ Decorators poluem o código de domínio

### Sequelize
- ❌ Menos type safety
- ❌ API menos moderna
- ❌ Menos suporte da comunidade

### Raw SQL
- ❌ Sem type safety
- ❌ Mais propenso a erros
- ❌ Mais trabalho manual

## Migração Futura

Se necessário migrar para outro ORM:
- Prisma Client é usado apenas na camada de Infrastructure
- Interfaces de Repository isolam o domínio
- Mappers já existem para conversão Domain ↔ Persistence
- Migração seria limitada à camada de Infrastructure

## Referências
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

## Histórico
- 2026-02-17: Decisão inicial documentada

