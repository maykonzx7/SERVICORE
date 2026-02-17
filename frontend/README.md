# ServiCore Frontend

Frontend do ServiCore desenvolvido com Vue 3 + TypeScript + Vite.

## Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn

## Setup Inicial

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Editar .env com suas configurações
```

3. Iniciar servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── modules/          # Módulos de funcionalidades
│   │   └── service-orders/
│   │       ├── components/
│   │       ├── views/
│   │       └── stores/
│   ├── shared/           # Código compartilhado
│   │   ├── api/          # Clientes de API
│   │   └── components/   # Componentes compartilhados
│   ├── router/           # Configuração de rotas
│   ├── App.vue           # Componente raiz
│   └── main.ts           # Entry point
├── public/               # Arquivos estáticos
└── index.html            # HTML principal
```

## Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Vue Router** - Roteamento
- **Pinia** - Gerenciamento de estado
- **Axios** - Cliente HTTP

## Funcionalidades

### Módulo Service Orders

- Listagem de ordens de serviço com paginação
- Criação de novas ordens
- Visualização de detalhes
- Ações: Iniciar, Finalizar, Cancelar
- Filtros por Company ID

## Desenvolvimento

O frontend está configurado para fazer proxy das requisições `/api` para o backend em `http://localhost:3000` durante o desenvolvimento.

## Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`.

