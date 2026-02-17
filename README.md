# ServiCore

Sistema de gestão de ordens de serviço desenvolvido com **DDD (Domain-Driven Design)**, **Arquitetura Hexagonal** e **CQRS Light**.

## 🏗️ Arquitetura

O ServiCore segue uma arquitetura moderna e escalável:

- **DDD (Domain-Driven Design)**: Modelagem focada no domínio de negócio
- **Hexagonal Architecture**: Isolamento do domínio de frameworks e tecnologias
- **CQRS Light**: Separação entre operações de escrita (Commands) e leitura (Queries)
- **Clean Code**: Princípios SOLID e boas práticas de desenvolvimento

### Stack Tecnológica

**Backend:**
- NestJS 11
- TypeScript 5
- Prisma ORM
- PostgreSQL
- Redis
- RabbitMQ

**Frontend:**
- Vue 3 (Composition API)
- TypeScript
- Pinia (State Management)
- Vue Router
- Vite

## 📁 Estrutura do Projeto

```
ServiCore/
├── backend/              # Backend NestJS
│   ├── src/
│   │   ├── shared/      # Base compartilhada (Domain, Application, Infrastructure)
│   │   └── modules/     # Módulos de domínio (DDD)
│   └── prisma/         # Schema e migrações do Prisma
├── frontend/            # Frontend Vue 3
│   └── src/
│       ├── modules/     # Módulos de funcionalidades
│       ├── shared/     # Componentes e utilitários compartilhados
│       └── router/      # Configuração de rotas
├── docker/              # Docker Compose para serviços de infraestrutura
└── docs/                # Documentação do projeto
    ├── ADR/            # Architecture Decision Records
    ├── DDD_STRATEGIC.md
    ├── UBIQUITOUS_LANGUAGE.md
    └── STATUS.md
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- Docker e Docker Compose
- Git

### Instalação

1. **Clonar o repositório:**
```bash
git clone <repo-url>
cd ServiCore
```

2. **Instalar dependências:**
```bash
npm run install:all
```

3. **Configurar variáveis de ambiente:**

Backend:
```bash
cd backend
cp env.example .env
# Editar .env com suas configurações
```

Frontend:
```bash
cd frontend
# Criar .env com VITE_API_URL=http://localhost:3000
```

4. **Subir serviços de infraestrutura:**
```bash
npm run docker:up
```

5. **Configurar banco de dados:**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

6. **Iniciar aplicação:**

Backend (em um terminal):
```bash
cd backend
npm run start:dev
```

Frontend (em outro terminal):
```bash
cd frontend
npm run dev
```

A aplicação estará disponível em:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## 📚 Documentação

### 🎯 Documentos Principais

- **[Plano Integrado de Desenvolvimento](./docs/INTEGRATED_DEVELOPMENT_PLAN.md)** ⭐ **NOVO**: Documento mestre que integra todos os processos
- **[Plano de Telas e Funcionalidades](./docs/SCREEN_AND_FEATURES_PLAN.md)**: Plano completo de funcionalidades do sistema
- **[Development Process](./DEVELOPMENT_PROCESS.md)**: Processo completo de desenvolvimento
- **[Status](./docs/STATUS.md)**: Status atual das implementações

### 📖 Documentação Técnica

- **[Quick Start](./docs/QUICK_START.md)**: Guia rápido para começar
- **[DDD Strategic](./docs/DDD_STRATEGIC.md)**: Modelagem estratégica DDD
- **[Ubiquitous Language](./docs/UBIQUITOUS_LANGUAGE.md)**: Linguagem ubíqua do domínio
- **[Frontend Development Guide](./docs/FRONTEND_DEVELOPMENT_GUIDE.md)**: Guia completo de desenvolvimento frontend
- **[ADRs](./docs/ADR/)**: Architecture Decision Records

## 🧪 Testes

### Backend

```bash
cd backend

# Todos os testes
npm run test:all

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend

```bash
cd frontend
npm run lint
```

## 🔧 Scripts Disponíveis

### Raiz do Projeto

- `npm run install:all` - Instala dependências de todos os projetos
- `npm run build:all` - Build de todos os projetos
- `npm run test:all` - Executa todos os testes
- `npm run lint:all` - Lint de todos os projetos
- `npm run docker:up` - Sobe serviços Docker
- `npm run docker:down` - Para serviços Docker

### Backend

- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run lint` - Executa ESLint
- `npm run format` - Formata código com Prettier
- `npm run validate` - Valida código (lint + format + test)
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:migrate` - Executa migrações

### Frontend

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa ESLint

## 🐳 Docker

### Desenvolvimento

```bash
# Subir serviços (PostgreSQL, Redis, RabbitMQ)
npm run docker:up

# Ver logs
cd docker
docker-compose logs -f

# Parar serviços
npm run docker:down
```

### Produção

```bash
# Build das imagens
docker build -t servicore-backend ./backend
docker build -t servicore-frontend ./frontend

# Ou usar docker-compose (quando disponível)
docker-compose -f docker/docker-compose.prod.yml up -d
```

## 🔄 CI/CD

O projeto possui pipeline CI/CD configurado com GitHub Actions:

- **Lint**: Validação de código
- **Build**: Compilação do projeto
- **Test**: Execução de testes unitários e de integração
- **Coverage**: Relatório de cobertura de código

Verifique `.github/workflows/ci.yml` para mais detalhes.

## 📋 Próximos Passos

Consulte o documento [STATUS.md](./docs/STATUS.md) para ver o progresso atual e próximas implementações.

## 🤝 Contribuindo

1. Siga o processo de desenvolvimento documentado em `DEVELOPMENT_PROCESS.md`
2. Mantenha a cobertura de testes acima de 80%
3. Siga os padrões de código (ESLint + Prettier)
4. Documente decisões arquiteturais em ADRs

## 📝 Licença

ISC

## 👥 Autores

Equipe ServiCore

---

**Última atualização:** 2026

