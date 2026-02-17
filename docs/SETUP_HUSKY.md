# Setup do Husky (Git Hooks)

Este guia explica como configurar o Husky para validação automática antes de commits e pushes.

## Instalação

1. **Instalar dependências na raiz do projeto:**
```bash
npm install
```

Isso instalará o Husky e executará o script `prepare` que configura os hooks.

2. **Verificar se os hooks foram criados:**
```bash
ls -la .husky/
```

Você deve ver:
- `pre-commit` - Executa validações antes de cada commit
- `pre-push` - Executa testes antes de cada push

## O que cada hook faz

### Pre-commit
Executa antes de cada commit:
- ✅ Validação do backend (lint + format:check + test:unit)
- ✅ Lint do frontend

**Tempo estimado:** 30-60 segundos

### Pre-push
Executa antes de cada push:
- ✅ Todos os testes do backend (unit + integration + e2e)

**Tempo estimado:** 2-5 minutos

## Pular hooks (quando necessário)

Se precisar pular os hooks em uma situação específica:

```bash
# Pular pre-commit
git commit --no-verify -m "mensagem"

# Pular pre-push
git push --no-verify
```

⚠️ **Atenção:** Use apenas em situações excepcionais. Os hooks existem para manter a qualidade do código.

## Desabilitar temporariamente

Se precisar desabilitar os hooks temporariamente:

```bash
# Renomear a pasta
mv .husky .husky.disabled

# Para reabilitar
mv .husky.disabled .husky
```

## Troubleshooting

### Hook não está executando
```bash
# Verificar se o arquivo é executável
chmod +x .husky/pre-commit
chmod +x .husky/pre-push

# Reinstalar hooks
npm run prepare
```

### Erro de permissão
```bash
# Tornar hooks executáveis
chmod +x .husky/*
```

### Husky não encontrado
```bash
# Reinstalar
npm install
# Isso executará automaticamente o script "prepare"
```

## Personalização

Para modificar os hooks, edite os arquivos em `.husky/`:

- `.husky/pre-commit` - Validações antes do commit
- `.husky/pre-push` - Testes antes do push

---

**Última atualização:** 2026

