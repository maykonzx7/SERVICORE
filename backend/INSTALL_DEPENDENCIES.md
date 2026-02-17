# Instalação de Dependências Adicionais

Este guia lista as dependências que precisam ser instaladas para as novas funcionalidades.

## Swagger/OpenAPI

Para habilitar a documentação Swagger da API:

```bash
cd backend
npm install --save @nestjs/swagger swagger-ui-express
```

## Logging Avançado (Opcional)

Se quiser usar um logger mais robusto no futuro (Winston ou Pino):

### Winston
```bash
npm install --save nest-winston winston
npm install --save-dev @types/winston
```

### Pino
```bash
npm install --save nestjs-pino pino-http
```

## Instalação Completa

Para instalar todas as dependências necessárias:

```bash
cd backend
npm install --save @nestjs/swagger swagger-ui-express
```

Após instalar, reinicie o servidor:

```bash
npm run start:dev
```

A documentação Swagger estará disponível em:
- http://localhost:3000/api/docs

---

**Nota:** O LoggerService atual usa o Logger padrão do NestJS, que não requer dependências adicionais. Para logging mais avançado, considere instalar Winston ou Pino conforme mostrado acima.

