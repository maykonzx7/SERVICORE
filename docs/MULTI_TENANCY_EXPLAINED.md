# Multi-tenancy no ServiCore — Explicação

## 🤔 Por que preciso escolher uma empresa?

O ServiCore é um sistema **multi-tenant**, o que significa que ele foi projetado para suportar múltiplas empresas (organizações) usando a mesma instância do sistema, mas com **isolamento completo de dados** entre elas.

## 🎯 Motivos da Arquitetura Multi-tenant

### 1. **Isolamento de Dados**
- Cada empresa vê apenas seus próprios dados
- Ordens de serviço, transações financeiras e usuários são isolados por empresa
- Segurança e privacidade garantidas

### 2. **Flexibilidade para Usuários**
- Um usuário pode trabalhar em múltiplas empresas
- Exemplo: Um consultor pode ter acesso a várias empresas clientes
- Cada empresa tem suas próprias configurações e permissões

### 3. **Escalabilidade**
- Uma única instância do sistema serve múltiplas empresas
- Reduz custos de infraestrutura
- Facilita manutenção e atualizações

## 🔄 Como Funciona

### Cenário 1: Usuário com Apenas Uma Empresa ✅
**Comportamento Automático:**
- O sistema detecta que você tem apenas uma empresa
- **Seleciona automaticamente** essa empresa
- Você não precisa escolher manualmente
- Acesso direto ao dashboard

### Cenário 2: Usuário com Múltiplas Empresas
**Comportamento:**
- O sistema mostra a tela de seleção de empresa
- Você escolhe qual empresa deseja acessar
- Pode trocar de empresa a qualquer momento pelo seletor no header
- Cada empresa mantém seus dados isolados

### Cenário 3: Primeiro Acesso
**Comportamento:**
- Se você não tem empresa associada, precisa criar ou solicitar acesso
- Após criar/obter acesso, a empresa é selecionada automaticamente (se for a única)

## 💡 Melhorias Implementadas

### Seleção Automática
- ✅ Se você tem **apenas 1 empresa**, ela é selecionada automaticamente
- ✅ Não precisa passar pela tela de seleção
- ✅ Acesso direto ao sistema

### Persistência
- ✅ Empresa selecionada é salva no navegador
- ✅ Na próxima visita, a mesma empresa é carregada automaticamente
- ✅ Pode trocar de empresa a qualquer momento

### Troca Rápida
- ✅ Seletor de empresa no header (quando tem múltiplas)
- ✅ Troca instantânea sem perder contexto
- ✅ Dados são recarregados automaticamente

## 🏗️ Arquitetura Técnica

### Backend
```typescript
// Todas as queries são filtradas por companyId
async function listServiceOrders(companyId: string) {
  return prisma.serviceOrder.findMany({
    where: { companyId } // Isolamento automático
  })
}
```

### Frontend
```typescript
// Store global mantém empresa atual
const companyStore = useCompanyStore()
const companyId = companyStore.companyId // Sempre disponível

// Todas as requisições incluem companyId
await api.get('/service-orders', { 
  params: { companyId } 
})
```

## 📊 Exemplo Prático

### Usuário: João Silva
- **Empresa A**: Consultor (acesso completo)
- **Empresa B**: Cliente (acesso limitado)

**Fluxo:**
1. João faz login
2. Sistema detecta 2 empresas
3. João escolhe "Empresa A"
4. Vê apenas ordens de serviço da Empresa A
5. Troca para "Empresa B" pelo seletor
6. Agora vê apenas dados da Empresa B

## ❓ FAQ

### P: Por que não posso ver dados de todas as empresas juntos?
**R:** Por segurança e organização. Cada empresa é um cliente separado com dados confidenciais. O isolamento garante privacidade e conformidade.

### P: Posso trabalhar em múltiplas empresas ao mesmo tempo?
**R:** Sim, mas uma de cada vez. Você pode trocar entre empresas rapidamente pelo seletor no header.

### P: E se eu tiver apenas uma empresa?
**R:** O sistema detecta automaticamente e seleciona sua empresa. Você não precisa escolher manualmente.

### P: Posso criar uma empresa pessoal?
**R:** Sim! Você pode criar uma empresa para uso pessoal. O sistema trata da mesma forma que qualquer outra empresa.

## 🔐 Segurança

- ✅ Isolamento garantido no banco de dados
- ✅ Validação de companyId em todas as operações
- ✅ Permissões podem ser específicas por empresa
- ✅ Auditoria rastreia ações por empresa

## 📝 Resumo

**Multi-tenancy é necessário porque:**
1. ✅ Permite que múltiplas empresas usem o mesmo sistema
2. ✅ Garante isolamento completo de dados
3. ✅ Facilita gestão e escalabilidade
4. ✅ Suporta usuários com acesso a múltiplas empresas

**Melhorias implementadas:**
- ✅ Seleção automática se você tem apenas 1 empresa
- ✅ Persistência da empresa escolhida
- ✅ Troca rápida entre empresas
- ✅ Experiência otimizada para cada cenário

---

**Última atualização:** 2026

