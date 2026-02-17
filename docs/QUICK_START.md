# ServiCore — Quick Start

> Guia rápido para começar a desenvolver no ServiCore

**Última atualização:** 2026

---

## 🚀 Setup Inicial

### 1. Pré-requisitos

```bash
# Verificar versões
node --version  # >= 18.x
npm --version   # >= 9.x
docker --version
docker-compose --version
```

### 2. Clonar e Configurar

```bash
# Clonar repositório
git clone <repo-url>
cd ServiCore

# Instalar dependências do backend
cd backend
npm install

# Copiar variáveis de ambiente
cp env.example .env
# Editar .env com suas configurações
```

### 3. Subir Serviços com Docker

```bash
# Subir PostgreSQL, Redis e RabbitMQ
cd ../docker
docker-compose up -d

# Verificar se estão rodando
docker-compose ps
```

### 4. Configurar Banco de Dados

```bash
cd ../backend

# Gerar Prisma Client
npm run prisma:generate

# Executar migrações (quando houver)
npm run prisma:migrate
```

### 5. Iniciar Desenvolvimento

```bash
# Backend em modo desenvolvimento
npm run start:dev

# Backend deve estar rodando em http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```
ServiCore/
├── backend/          # Backend NestJS
│   ├── src/
│   │   ├── shared/   # Base compartilhada ✅
│   │   └── modules/  # Módulos do sistema
│   └── prisma/       # Schema e migrações
├── frontend/         # Frontend Vue 3
├── docs/             # Documentação
│   ├── DDD_STRATEGIC.md
│   ├── UBIQUITOUS_LANGUAGE.md
│   ├── AGGREGATES.md
│   └── WORKFLOW_IMPROVEMENTS.md
└── docker/           # Docker Compose
```

---

## 🎯 Fluxo de Desenvolvimento

### Criar um Novo Módulo

1. **Fase 1: Modelagem** (já feita)
   - ✅ Bounded Contexts mapeados
   - ✅ Linguagem Ubíqua definida
   - ✅ Aggregates identificados

2. **Fase 2: Base Compartilhada** (já feita)
   - ✅ BaseEntity, AggregateRoot
   - ✅ ValueObject, DomainEvent
   - ✅ Result Pattern
   - ✅ PrismaService

3. **Fase 3: Domínio** (próximo passo)
   ```bash
   # Criar estrutura do módulo
   mkdir -p backend/src/modules/{module-name}/domain/{entities,value-objects,events,repositories}
   
   # Implementar na ordem:
   # 1. Value Objects
   # 2. Entities
   # 3. Aggregate Root
   # 4. Domain Events
   # 5. Repository Interface
   ```

4. **Fase 4: Aplicação**
   ```bash
   # Use Cases (Write Side)
   mkdir -p backend/src/modules/{module-name}/application/use-cases
   
   # Queries (Read Side)
   mkdir -p backend/src/modules/{module-name}/application/queries
   ```

5. **Fase 5: Infraestrutura**
   ```bash
   # Repository Implementation
   mkdir -p backend/src/modules/{module-name}/infrastructure/persistence
   
   # Query Service
   mkdir -p backend/src/modules/{module-name}/infrastructure/persistence
   ```

6. **Fase 6: Apresentação**
   ```bash
   # Controllers e DTOs
   mkdir -p backend/src/modules/{module-name}/presentation/{controllers,dtos}
   ```

---

## 📝 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar backend em modo dev
npm run start:dev

# Build do projeto
npm run build

# Executar build
npm start
```

### Prisma

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar nova migração
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio
```

### Docker

```bash
# Subir serviços
docker-compose -f docker/docker-compose.yml up -d

# Ver logs
docker-compose -f docker/docker-compose.yml logs -f

# Parar serviços
docker-compose -f docker/docker-compose.yml down
```

---

## 🧪 Testes (quando configurado)

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:cov
```

---

## 📚 Documentação

- **Processo de Desenvolvimento:** [`DEVELOPMENT_PROCESS.md`](../DEVELOPMENT_PROCESS.md)
- **Workflow:** [`WorkFlow.md`](../WorkFlow.md)
- **DDD Estratégico:** [`docs/DDD_STRATEGIC.md`](./DDD_STRATEGIC.md)
- **Linguagem Ubíqua:** [`docs/UBIQUITOUS_LANGUAGE.md`](./UBIQUITOUS_LANGUAGE.md)
- **Aggregates:** [`docs/AGGREGATES.md`](./AGGREGATES.md)
- **Melhorias:** [`docs/WORKFLOW_IMPROVEMENTS.md`](./WORKFLOW_IMPROVEMENTS.md)

---

## ⚠️ Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
npm run prisma:generate
```

### Erro: "Database connection failed"

1. Verificar se Docker está rodando
2. Verificar variável `DATABASE_URL` no `.env`
3. Verificar se PostgreSQL está acessível

### Erro: "Port 3000 already in use"

```bash
# Encontrar processo
lsof -i :3000

# Matar processo ou mudar porta no .env
```

---

## 🎯 Próximos Passos

1. ✅ Fase 1: Modelagem Estratégica (DDD) - **Concluída**
2. ✅ Fase 2: Base Compartilhada - **Concluída**
3. ⏭️ Fase 3: Desenvolvimento do Domínio - **Próximo**
4. ⏭️ Fase 4: Camada de Aplicação
5. ⏭️ Fase 5: Infraestrutura
6. ⏭️ Fase 6: Apresentação

---

**Dúvidas?** Consulte a documentação completa ou abra uma issue.


