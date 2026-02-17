# ServiCore Backend

Backend do ServiCore desenvolvido com NestJS, seguindo arquitetura DDD + Hexagonal + CQRS Leve.

## Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- Docker e Docker Compose (para serviços de infraestrutura)

## Setup Inicial

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp env.example .env
# Editar .env com suas configurações
```

3. Iniciar serviços de infraestrutura (PostgreSQL, Redis, RabbitMQ):
```bash
cd ../docker
docker-compose up -d
```

4. Gerar Prisma Client:
```bash
npm run prisma:generate
```

5. Executar migrações:
```bash
npm run prisma:migrate
```

## Scripts Disponíveis

- `npm run build` - Compila o projeto TypeScript
- `npm run start` - Inicia o servidor em modo produção
- `npm run start:dev` - Inicia o servidor em modo desenvolvimento com hot-reload
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Executa migrações do banco de dados
- `npm run prisma:studio` - Abre o Prisma Studio para visualizar dados

## Estrutura do Projeto

```
backend/
├── src/
│   ├── shared/          # Código compartilhado entre módulos
│   ├── modules/         # Módulos de domínio (DDD)
│   └── config/          # Configurações da aplicação
├── prisma/              # Schema e migrações do Prisma
└── dist/                # Código compilado (gerado)
```

## Próximos Passos

Seguir o guia em `../DEVELOPMENT_PROCESS.md` para continuar o desenvolvimento.

