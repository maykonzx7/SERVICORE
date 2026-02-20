# ServiCore — Configuração do Ngrok

> Guia para configurar e usar o ngrok para expor o sistema localmente durante desenvolvimento

**Última atualização:** 2026  
**Versão:** 1.0.0

---

## 📋 Índice

1. [O que é o Ngrok?](#o-que-é-o-ngrok)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Uso com o ServiCore](#uso-com-o-servicore)
5. [Casos de Uso](#casos-de-uso)
6. [Troubleshooting](#troubleshooting)

---

## 🔍 O que é o Ngrok?

O **ngrok** é uma ferramenta que cria túneis seguros para expor serviços locais na internet. É útil para:

- ✅ Testar webhooks de serviços externos (pagamentos, notificações)
- ✅ Testar integrações com APIs externas
- ✅ Permitir acesso remoto durante desenvolvimento
- ✅ Testar em dispositivos móveis conectados à mesma rede
- ✅ Compartilhar o ambiente de desenvolvimento com a equipe

---

## 📦 Instalação

### Opção 1: Instalação Global (Recomendado)

```bash
# macOS
brew install ngrok/ngrok/ngrok

# Linux (usando snap)
sudo snap install ngrok

# Ou baixar diretamente do site oficial
# https://ngrok.com/download
```

### Opção 2: Via npm (Local ao Projeto)

```bash
# No diretório raiz do projeto
npm install -D ngrok

# Ou globalmente
npm install -g ngrok
```

### Opção 3: Docker

```bash
docker run -it --rm -p 4040:4040 ngrok/ngrok http 3000
```

---

## ⚙️ Configuração

### 1. Criar Conta no Ngrok (Opcional mas Recomendado)

1. Acesse [https://ngrok.com](https://ngrok.com)
2. Crie uma conta gratuita
3. Obtenha seu **authtoken** no dashboard

### 2. Configurar Authtoken

```bash
# Configurar o token (substitua YOUR_AUTH_TOKEN pelo seu token)
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

Isso salva o token em `~/.ngrok2/ngrok.yml` (Linux/macOS) ou `%USERPROFILE%\.ngrok2\ngrok.yml` (Windows).

### 3. Verificar Configuração

```bash
ngrok config check
```

---

## 🚀 Uso com o ServiCore

### Expor o Backend (Porta 3000)

#### Método 1: Linha de Comando Simples

```bash
# Expor backend na porta 3000
ngrok http 3000
```

Isso criará um túnel e você verá algo como:

```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

#### Método 2: Com Configuração Avançada

Criar arquivo `ngrok.yml` na raiz do projeto:

```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN  # Opcional se já configurado

tunnels:
  backend:
    addr: 3000
    proto: http
    bind_tls: true  # Força HTTPS
    inspect: true   # Habilita dashboard em http://localhost:4040
    hostname: servicore-dev.ngrok.io  # Requer plano pago
```

Executar:

```bash
ngrok start backend
```

#### Método 3: Script NPM (Recomendado)

Adicionar ao `package.json` na raiz:

```json
{
  "scripts": {
    "ngrok:backend": "ngrok http 3000",
    "ngrok:frontend": "ngrok http 5173",
    "ngrok:all": "concurrently \"ngrok http 3000\" \"ngrok http 5173\""
  }
}
```

**Nota:** Para `ngrok:all`, instalar `concurrently`:
```bash
npm install -D concurrently
```

### Expor o Frontend (Porta 5173)

```bash
# Expor frontend na porta 5173
ngrok http 5173
```

### Expor Ambos Simultaneamente

```bash
# Terminal 1: Backend
ngrok http 3000

# Terminal 2: Frontend
ngrok http 5173
```

Ou usar o script `ngrok:all` se configurado.

---

## 📝 Casos de Uso

### 1. Testar Webhooks de Pagamento

Quando integrando com gateways de pagamento (Stripe, PagSeguro, etc.), você precisa de uma URL pública para receber webhooks:

```bash
# 1. Iniciar ngrok
ngrok http 3000

# 2. Copiar a URL HTTPS (ex: https://abc123.ngrok-free.app)

# 3. Configurar no gateway de pagamento:
# Webhook URL: https://abc123.ngrok-free.app/api/webhooks/payment

# 4. Testar o webhook
```

### 2. Testar em Dispositivo Móvel

```bash
# 1. Iniciar backend com ngrok
ngrok http 3000

# 2. Iniciar frontend com ngrok
ngrok http 5173

# 3. Configurar frontend para usar URL do ngrok do backend
# No .env do frontend:
VITE_API_URL=https://abc123.ngrok-free.app

# 4. Acessar no dispositivo móvel:
# https://xyz789.ngrok-free.app
```

### 3. Compartilhar com Equipe

```bash
# 1. Iniciar ngrok
ngrok http 3000

# 2. Compartilhar a URL HTTPS com a equipe
# Eles podem acessar o backend diretamente

# 3. Para frontend, repetir o processo na porta 5173
```

### 4. Testar Integrações com APIs Externas

Algumas APIs externas precisam de URLs públicas para callbacks:

```bash
# 1. Iniciar ngrok
ngrok http 3000

# 2. Configurar callback URL na API externa:
# https://abc123.ngrok-free.app/api/integrations/callback

# 3. Testar a integração
```

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Criar arquivo `.env` na raiz (ou adicionar ao `.env` existente):

```env
# Ngrok Configuration
NGROK_AUTHTOKEN=your_auth_token_here
NGROK_BACKEND_PORT=3000
NGROK_FRONTEND_PORT=5173
```

### Script de Inicialização Automática

Criar `scripts/start-with-ngrok.sh`:

```bash
#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando ServiCore com Ngrok...${NC}"

# Iniciar backend em background
echo -e "${GREEN}📦 Iniciando backend...${NC}"
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Aguardar backend iniciar
sleep 5

# Iniciar frontend em background
echo -e "${GREEN}🎨 Iniciando frontend...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Aguardar frontend iniciar
sleep 5

# Iniciar ngrok para backend
echo -e "${GREEN}🌐 Iniciando ngrok para backend (porta 3000)...${NC}"
ngrok http 3000 &
NGROK_BACKEND_PID=$!

# Aguardar um pouco
sleep 2

# Iniciar ngrok para frontend
echo -e "${GREEN}🌐 Iniciando ngrok para frontend (porta 5173)...${NC}"
ngrok http 5173 &
NGROK_FRONTEND_PID=$!

echo -e "${BLUE}✅ ServiCore rodando com ngrok!${NC}"
echo -e "${BLUE}📊 Dashboard ngrok: http://localhost:4040${NC}"
echo -e "${BLUE}🔙 Backend local: http://localhost:3000${NC}"
echo -e "${BLUE}🎨 Frontend local: http://localhost:5173${NC}"

# Função para limpar processos ao sair
cleanup() {
    echo -e "\n${BLUE}🛑 Parando processos...${NC}"
    kill $BACKEND_PID $FRONTEND_PID $NGROK_BACKEND_PID $NGROK_FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Aguardar indefinidamente
wait
```

Tornar executável:

```bash
chmod +x scripts/start-with-ngrok.sh
```

Usar:

```bash
./scripts/start-with-ngrok.sh
```

### Integração com Docker Compose

Adicionar ao `docker/docker-compose.yml`:

```yaml
version: "3.8"

services:
  # ... outros serviços ...

  ngrok-backend:
    image: ngrok/ngrok:latest
    command: http backend:3000
    ports:
      - "4040:4040"
    environment:
      - NGROK_AUTHTOKEN=${NGROK_AUTHTOKEN}
    depends_on:
      - backend
    profiles:
      - ngrok

  ngrok-frontend:
    image: ngrok/ngrok:latest
    command: http frontend:5173
    ports:
      - "4041:4040"
    environment:
      - NGROK_AUTHTOKEN=${NGROK_AUTHTOKEN}
    depends_on:
      - frontend
    profiles:
      - ngrok
```

Usar:

```bash
# Iniciar com ngrok
docker-compose --profile ngrok up -d

# Ver logs do ngrok
docker-compose logs -f ngrok-backend
```

---

## 🐛 Troubleshooting

### Erro: "authtoken is required"

**Solução:**
```bash
# Configurar authtoken
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Erro: "bind: address already in use"

**Solução:**
```bash
# Verificar qual processo está usando a porta
lsof -i :4040

# Matar o processo ou usar outra porta
ngrok http 3000 --log=stdout > /dev/null &
```

### URL do Ngrok Muda a Cada Início

**Solução:**
- Usar plano pago do ngrok para URLs fixas
- Ou usar `ngrok.yml` com `hostname` (requer plano pago)

### Webhook Não Está Recebendo Requisições

**Solução:**
1. Verificar se o backend está rodando
2. Verificar se a URL do ngrok está correta
3. Verificar logs do ngrok: `http://localhost:4040`
4. Verificar se o endpoint do webhook está configurado corretamente

### CORS Errors ao Acessar via Ngrok

**Solução:**
Configurar CORS no backend para aceitar o domínio do ngrok:

```typescript
// backend/src/main.ts
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://*.ngrok-free.app',
    'https://*.ngrok.io',
  ],
  credentials: true,
});
```

---

## 📚 Recursos Adicionais

- [Documentação Oficial do Ngrok](https://ngrok.com/docs)
- [Ngrok Dashboard](http://localhost:4040) - Disponível quando ngrok está rodando
- [Ngrok API](https://ngrok.com/docs/api) - Para automação

---

## ⚠️ Avisos Importantes

1. **Segurança**: URLs do ngrok são públicas. Não use em produção!
2. **Limites**: Plano gratuito tem limites de conexões e largura de banda
3. **URLs Temporárias**: URLs mudam a cada reinício (exceto com plano pago)
4. **Logs**: Ngrok mantém logs de todas as requisições no dashboard

---

## 🎯 Próximos Passos

1. ✅ Configurar authtoken (se ainda não fez)
2. ✅ Testar exposição do backend
3. ✅ Testar exposição do frontend
4. ✅ Configurar webhooks (se necessário)
5. ✅ Documentar URLs do ngrok para a equipe (se compartilhando)

---

**Última atualização:** 2026  
**Versão:** 1.0.0

