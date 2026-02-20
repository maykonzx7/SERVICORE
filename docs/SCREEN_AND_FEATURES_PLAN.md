# ServiCore — Plano de Telas e Funcionalidades

> Plano completo de telas e funcionalidades que o sistema DEVE ter para ser um sistema corporacional completo

**📘 Documento Relacionado:** Para ver como implementar estas funcionalidades seguindo a arquitetura correta, consulte **[Plano Integrado de Desenvolvimento](./INTEGRATED_DEVELOPMENT_PLAN.md)**

**Última atualização:** 2026  
**Versão:** 1.0.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Módulo: Identity & Access](#módulo-identity--access)
3. [Módulo: Organization](#módulo-organization)
4. [Módulo: Service Order](#módulo-service-order)
5. [Módulo: Financial](#módulo-financial)
6. [Módulo: Notifications](#módulo-notifications)
7. [Módulo: Reports & Analytics](#módulo-reports--analytics)
8. [Módulo: Settings & Configuration](#módulo-settings--configuration)
9. [Módulo: Dashboard & Home](#módulo-dashboard--home)
10. [Priorização](#priorização)

---

## 🎯 Visão Geral

Este documento define todas as telas e funcionalidades necessárias para transformar o ServiCore em um sistema corporacional completo, seguindo os princípios de DDD e a arquitetura definida.

### Princípios de Design

- **Multi-tenant**: Todas as funcionalidades respeitam isolamento por empresa
- **Role-based Access Control**: Controle de acesso baseado em roles e permissões
- **Auditoria**: Rastreamento de todas as ações importantes
- **Responsividade**: Interface adaptável para desktop, tablet e mobile
- **Acessibilidade**: Seguindo padrões WCAG 2.1

---

## 🔐 Módulo: Identity & Access

### Status Atual
- ✅ Login
- ✅ Registro
- ✅ Recuperação de senha
- ✅ Perfil básico

### Telas e Funcionalidades Necessárias

#### 1. Autenticação e Autorização

##### 1.1 Login (`/login`)
**Status:** ✅ Implementado  
**Funcionalidades:**
- [x] Login com email e senha
- [x] Validação de campos
- [x] Mensagens de erro
- [ ] Login com Google OAuth
- [ ] Login com Microsoft OAuth
- [ ] Login com SSO (Single Sign-On)
- [ ] Autenticação de dois fatores (2FA)
- [ ] "Lembrar-me" (Remember me)
- [ ] Captcha para prevenção de bots
- [ ] Rate limiting visual

##### 1.2 Registro (`/register`)
**Status:** ✅ Implementado  
**Funcionalidades:**
- [x] Registro com email e senha
- [x] Validação de campos
- [ ] Registro com convite (invite link)
- [ ] Verificação de email obrigatória
- [ ] Aceite de termos e condições
- [ ] Aceite de política de privacidade
- [ ] Validação de força de senha em tempo real

##### 1.3 Recuperação de Senha (`/password-reset`)
**Status:** ✅ Implementado  
**Funcionalidades:**
- [x] Solicitação de reset
- [x] Confirmação de reset
- [ ] Link de reset com expiração
- [ ] Histórico de resets de senha
- [ ] Notificação de tentativas de reset

##### 1.4 Verificação de Email (`/verify-email`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Envio de email de verificação
- [ ] Verificação via link
- [ ] Verificação via código
- [ ] Reenvio de email de verificação
- [ ] Status de verificação no perfil

##### 1.5 Autenticação de Dois Fatores (`/2fa`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Configuração de 2FA (TOTP)
- [ ] Backup codes
- [ ] Desativação de 2FA
- [ ] QR Code para apps autenticadores
- [ ] Histórico de logins com 2FA

#### 2. Gestão de Usuários

##### 2.1 Lista de Usuários (`/users`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Listagem paginada de usuários
- [x] Filtros (nome, email, role, status)
- [x] Busca por texto
- [ ] Ordenação (nome, email, data de criação, último acesso)
- [x] Visualização em tabela
- [ ] Visualização em cards
- [ ] Exportação para CSV/Excel
- [ ] Ações em lote (ativar, desativar, deletar)
- [x] Indicadores visuais (status, roles)

##### 2.2 Detalhes do Usuário (`/users/:id`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Informações pessoais (nome, email)
- [x] Roles e permissões atribuídas
- [ ] Telefone
- [ ] Foto
- [ ] Empresas associadas
- [ ] Departamentos
- [ ] Histórico de atividades
- [ ] Sessões ativas
- [ ] Estatísticas (ordens criadas, concluídas, etc.)
- [ ] Timeline de eventos
- [x] Ações (editar, atribuir roles)
- [ ] Desativar
- [ ] Resetar senha
- [ ] Deletar

##### 2.3 Criar/Editar Usuário (`/users/create`, `/users/:id/edit`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Formulário de criação/edição
- [x] Atribuição de roles
- [ ] Upload de foto de perfil
- [ ] Associação a empresas
- [ ] Associação a departamentos
- [ ] Definição de permissões customizadas
- [ ] Envio de email de boas-vindas
- [ ] Geração de senha temporária
- [x] Validação de email único

##### 2.4 Meu Perfil (`/profile`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Visualização de dados básicos
- [ ] Edição de informações pessoais
- [ ] Upload e edição de foto
- [ ] Alteração de senha
- [ ] Configurações de notificações
- [ ] Preferências de idioma
- [ ] Preferências de tema (claro/escuro)
- [ ] Histórico de atividades pessoais
- [ ] Sessões ativas e gerenciamento
- [ ] Logout de todas as sessões
- [ ] Download de dados pessoais (LGPD)

#### 3. Gestão de Roles e Permissões

##### 3.1 Lista de Roles (`/roles`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Listagem de roles do sistema
- [x] Roles padrão (ADMIN, COMPANY_ADMIN, MANAGER, TECHNICIAN, CLIENT, USER)
- [ ] Roles customizados por empresa
- [ ] Filtros e busca
- [x] Indicadores (quantidade de permissões por role)
- [ ] Ações (criar, editar, deletar, duplicar)

##### 3.2 Detalhes/Criar/Editar Role (`/roles/:role`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Nome e descrição do role
- [x] Lista de permissões disponíveis
- [x] Preview de permissões
- [ ] Seleção de permissões (hierárquica) - apenas visualização
- [ ] Usuários com este role
- [ ] Validação de dependências entre permissões
- [ ] Histórico de alterações
- [ ] Criar/Editar role (roles são fixos no sistema)

##### 3.3 Gestão de Permissões (`/permissions`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Lista completa de permissões do sistema
- [x] Agrupamento por módulo (resource)
- [ ] Descrição de cada permissão
- [ ] Permissões customizadas por empresa
- [x] Matriz de roles x permissões (`/roles/matrix`)
- [ ] Exportação de matriz

#### 4. Gestão de Sessões

##### 4.1 Sessões Ativas (`/sessions`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Lista de sessões ativas do usuário
- [ ] Informações (IP, User-Agent, localização, última atividade)
- [ ] Encerrar sessão específica
- [ ] Encerrar todas as outras sessões
- [ ] Histórico de sessões
- [ ] Alertas de login suspeito

---

## 🏢 Módulo: Organization

### Status Atual
- ✅ Seleção de empresa
- ✅ Lista de empresas
- ✅ Detalhes de empresa
- ✅ Configurações básicas

### Telas e Funcionalidades Necessárias

#### 1. Gestão de Empresas

##### 1.1 Lista de Empresas (`/companies`)
**Status:** ✅ Implementado (expandido)  
**Funcionalidades:**
- [x] Listagem de empresas
- [x] Filtros (nome, CNPJ, status)
- [x] Busca avançada (nome, CNPJ, email, cidade, estado)
- [x] Ordenação (nome, data de criação, CNPJ)
- [x] Visualização em cards
- [ ] Visualização em tabela e grid
- [ ] Indicadores por empresa (usuários, ordens, receita)
- [ ] Exportação
- [ ] Ações em lote

##### 1.2 Detalhes da Empresa (`/companies/:id`)
**Status:** ✅ Implementado (expandido)  
**Funcionalidades:**
- [x] Informações básicas
- [x] Informações completas (CNPJ, endereço, contatos)
- [x] Estatísticas gerais (endpoint criado)
- [ ] Plano de assinatura e limites
- [ ] Usuários da empresa
- [ ] Departamentos
- [ ] Histórico de atividades
- [ ] Documentos anexados
- [ ] Timeline de eventos
- [x] Ações (editar, desativar)
- [ ] Exportar dados

##### 1.3 Criar/Editar Empresa (`/companies/create`, `/companies/:id/edit`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Formulário completo
- [x] Validação de CNPJ (Value Object criado)
- [ ] Upload de logo
- [x] Endereço completo (campos disponíveis)
- [ ] Busca automática de CEP
- [x] Dados de contato (telefone, email)
- [ ] Site
- [ ] Configuração de plano
- [ ] Definição de limites
- [ ] Configurações iniciais

##### 1.4 Configurações da Empresa (`/companies/:id/settings`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Configurações básicas
- [ ] Configurações gerais (nome, logo, moeda, fuso horário)
- [ ] Configurações de negócio (ramo, tamanho)
- [ ] Configurações de notificações
- [ ] Configurações de integrações
- [ ] Configurações de segurança
- [ ] Configurações de faturamento
- [ ] Histórico de alterações
- [ ] Backup de configurações

#### 2. Gestão de Departamentos

##### 2.1 Lista de Departamentos (`/companies/:id/departments`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Listagem hierárquica de departamentos
- [ ] Visualização em árvore
- [ ] Filtros e busca
- [ ] Indicadores (usuários, orçamento, ordens)
- [ ] Ações (criar, editar, deletar, mover)

##### 2.2 Criar/Editar Departamento (`/companies/:id/departments/create`, `/departments/:id/edit`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Nome e descrição
- [ ] Departamento pai (hierarquia)
- [ ] Responsável do departamento
- [ ] Orçamento
- [ ] Usuários do departamento
- [ ] Permissões específicas

#### 3. Multi-tenancy

##### 3.1 Seletor de Empresa (`/company-selection`)
**Status:** ✅ Implementado  
**Funcionalidades:**
- [x] Lista de empresas do usuário
- [x] Seleção de empresa
- [ ] Busca de empresa
- [ ] Filtros
- [ ] Criação rápida de empresa (se permitido)
- [ ] Solicitação de acesso a empresa

##### 3.2 Troca de Empresa (Header/Sidebar)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Seletor no header
- [ ] Dropdown com empresas recentes
- [ ] Busca rápida
- [ ] Indicador de empresa atual
- [ ] Atalho de teclado

---

## 📋 Módulo: Service Order

### Status Atual
- ✅ Lista de ordens
- ✅ Criar ordem
- ✅ Detalhes da ordem
- ✅ Ações básicas (iniciar, completar, cancelar)
- ✅ Filtros básicos

### Telas e Funcionalidades Necessárias

#### 1. Gestão de Ordens de Serviço

##### 1.1 Lista de Ordens (`/service-orders`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Listagem paginada
- [x] Filtros básicos
- [ ] Filtros avançados (data, status, prioridade, responsável, cliente, valor)
- [ ] Filtros salvos (favoritos)
- [ ] Busca por texto (descrição, número, cliente)
- [ ] Ordenação múltipla
- [ ] Visualizações (tabela, cards, kanban, timeline)
- [ ] Agrupamento (por status, responsável, cliente)
- [ ] Exportação (CSV, Excel, PDF)
- [ ] Ações em lote
- [ ] Indicadores visuais (prioridade, status, vencimento)
- [ ] Filtros por período (hoje, semana, mês, customizado)
- [ ] Filtros por localização (se aplicável)

##### 1.2 Detalhes da Ordem (`/service-orders/:id`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Informações básicas
- [x] Histórico básico
- [ ] Informações completas (todos os campos)
- [ ] Timeline visual completa
- [ ] Anexos e documentos
- [ ] Comentários e observações
- [ ] Checklist de tarefas
- [ ] Custos e materiais
- [ ] Fotos e evidências
- [ ] Assinaturas (cliente, técnico)
- [ ] QR Code da ordem
- [ ] Compartilhamento (link público)
- [ ] Impressão
- [ ] Exportação para PDF
- [ ] Histórico completo de alterações
- [ ] Log de auditoria
- [ ] Ações contextuais (editar, duplicar, cancelar, reabrir)
- [ ] Navegação entre ordens (anterior/próxima)

##### 1.3 Criar Ordem (`/service-orders/create`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Formulário básico
- [ ] Formulário completo (todos os campos)
- [ ] Validação em tempo real
- [ ] Templates de ordem
- [ ] Duplicar ordem existente
- [ ] Criação rápida (modal)
- [ ] Criação em lote (importação)
- [ ] Sugestões inteligentes
- [ ] Validação de regras de negócio
- [ ] Preview antes de salvar
- [ ] Salvar como rascunho

##### 1.4 Editar Ordem (`/service-orders/:id/edit`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Edição de campos permitidos
- [ ] Validação de permissões
- [ ] Histórico de edições
- [ ] Bloqueio de edição simultânea
- [ ] Comparação de versões

#### 2. Visualizações Alternativas

##### 2.1 Kanban Board (`/service-orders/kanban`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Colunas por status
- [ ] Cards arrastáveis (drag & drop)
- [ ] Filtros aplicáveis
- [ ] Agrupamento adicional
- [ ] Indicadores visuais
- [ ] Ações rápidas nos cards
- [ ] Personalização de colunas

##### 2.2 Timeline/Gantt (`/service-orders/timeline`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Visualização temporal
- [ ] Linha do tempo
- [ ] Dependências entre ordens
- [ ] Zoom e navegação
- [ ] Filtros temporais
- [ ] Exportação de imagem

##### 2.3 Mapa (`/service-orders/map`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Visualização em mapa
- [ ] Marcadores por localização
- [ ] Agrupamento por região
- [ ] Filtros geográficos
- [ ] Rotas otimizadas
- [ ] Integração com Google Maps/OpenStreetMap

#### 3. Ações e Workflow

##### 3.1 Ações de Ordem
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Iniciar ordem
- [x] Completar ordem
- [x] Cancelar ordem
- [ ] Pausar ordem
- [ ] Reabrir ordem
- [ ] Rejeitar ordem
- [ ] Transferir ordem
- [ ] Atribuir responsável
- [ ] Alterar prioridade
- [ ] Adicionar comentário
- [ ] Adicionar anexo
- [ ] Enviar para aprovação
- [ ] Aprovar/Rejeitar
- [ ] Agendar ordem
- [ ] Enviar notificação

##### 3.2 Workflow Customizado
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Definição de estados customizados
- [ ] Definição de transições
- [ ] Regras de transição
- [ ] Aprovações obrigatórias
- [ ] Notificações automáticas
- [ ] Ações automáticas

#### 4. Templates e Modelos

##### 4.1 Templates de Ordem (`/service-orders/templates`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Lista de templates
- [ ] Criar template
- [ ] Editar template
- [ ] Duplicar template
- [ ] Usar template na criação
- [ ] Categorização de templates
- [ ] Variáveis dinâmicas

#### 5. Relacionamentos

##### 5.1 Clientes (`/clients`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Lista de clientes
- [ ] Criar/editar cliente
- [ ] Detalhes do cliente
- [ ] Histórico de ordens do cliente
- [ ] Contatos do cliente
- [ ] Endereços do cliente
- [ ] Documentos do cliente
- [ ] Estatísticas do cliente

##### 5.2 Fornecedores (`/suppliers`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Lista de fornecedores
- [ ] Criar/editar fornecedor
- [ ] Detalhes do fornecedor
- [ ] Histórico de relacionamento
- [ ] Avaliações
- [ ] Documentos

---

## 💰 Módulo: Financial

### Status Atual
- ✅ Dashboard financeiro básico
- ✅ Lista de transações
- ✅ Criar transação
- ✅ Detalhes de transação

### Telas e Funcionalidades Necessárias

#### 1. Dashboard Financeiro

##### 1.1 Dashboard Principal (`/financial/dashboard`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Visão geral básica
- [ ] KPIs principais (receita, despesas, saldo, fluxo de caixa)
- [ ] Gráficos (receita vs despesas, tendências, projeções)
- [ ] Contas a receber (vencidas, a vencer)
- [ ] Contas a pagar (vencidas, a vencer)
- [ ] Top clientes
- [ ] Top fornecedores
- [ ] Filtros por período
- [ ] Comparação de períodos
- [ ] Exportação de relatórios
- [ ] Widgets personalizáveis
- [ ] Alertas financeiros

#### 2. Transações

##### 2.1 Lista de Transações (`/transactions`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Listagem básica
- [ ] Filtros avançados (tipo, categoria, período, valor, status)
- [ ] Busca
- [ ] Agrupamento (por dia, semana, mês, categoria)
- [ ] Ordenação
- [ ] Visualização em tabela e cards
- [ ] Exportação
- [ ] Ações em lote
- [ ] Reconciliação bancária
- [ ] Importação de extratos

##### 2.2 Detalhes da Transação (`/transactions/:id`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Informações básicas
- [ ] Informações completas
- [ ] Histórico de alterações
- [ ] Anexos (comprovantes, notas fiscais)
- [ ] Relacionamento com ordem de serviço
- [ ] Ações (editar, estornar, cancelar, aprovar)
- [ ] Comentários

##### 2.3 Criar/Editar Transação (`/transactions/create`, `/transactions/:id/edit`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Formulário básico
- [ ] Formulário completo
- [ ] Categorização
- [ ] Associação a ordem de serviço
- [ ] Associação a conta bancária
- [ ] Upload de comprovante
- [ ] Validações
- [ ] Sugestões inteligentes
- [ ] Criação em lote

#### 3. Contas a Receber

##### 3.1 Lista de Contas a Receber (`/financial/receivables`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Listagem de contas a receber
- [ ] Filtros (status, vencimento, cliente, valor)
- [ ] Indicadores (total, vencidas, a vencer)
- [ ] Agrupamento por status
- [ ] Ordenação por vencimento
- [ ] Ações (receber, estornar, cancelar)
- [ ] Exportação
- [ ] Geração de boletos
- [ ] Envio de cobrança

##### 3.2 Detalhes da Conta a Receber (`/financial/receivables/:id`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Informações completas
- [ ] Histórico de pagamentos
- [ ] Histórico de tentativas de cobrança
- [ ] Anexos
- [ ] Ações (receber, estornar, cancelar, renegociar)
- [ ] Impressão de recibo

##### 3.3 Receber Pagamento (`/financial/receivables/:id/receive`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Formulário de recebimento
- [ ] Seleção de método de pagamento
- [ ] Valor parcial
- [ ] Desconto e juros
- [ ] Upload de comprovante
- [ ] Geração de recibo

#### 4. Contas a Pagar

##### 4.1 Lista de Contas a Pagar (`/financial/payables`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Listagem de contas a pagar
- [ ] Filtros (status, vencimento, fornecedor, valor)
- [ ] Indicadores (total, vencidas, a vencer)
- [ ] Agrupamento por status
- [ ] Ordenação por vencimento
- [ ] Ações (pagar, estornar, cancelar)
- [ ] Exportação
- [ ] Aprovação de pagamentos

##### 4.2 Detalhes da Conta a Pagar (`/financial/payables/:id`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Informações completas
- [ ] Histórico de pagamentos
- [ ] Anexos (notas fiscais)
- [ ] Ações (pagar, estornar, cancelar, renegociar)
- [ ] Impressão

##### 4.3 Efetuar Pagamento (`/financial/payables/:id/pay`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Formulário de pagamento
- [ ] Seleção de método de pagamento
- [ ] Seleção de conta bancária
- [ ] Valor parcial
- [ ] Upload de comprovante
- [ ] Aprovação (se necessário)

#### 5. Faturas (Invoices)

##### 5.1 Lista de Faturas (`/financial/invoices`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Listagem de faturas
- [ ] Filtros (status, número, cliente, período)
- [ ] Status (rascunho, emitida, cancelada)
- [ ] Busca por número NFe
- [ ] Exportação
- [ ] Ações (emitir, cancelar, duplicar)

##### 5.2 Detalhes da Fatura (`/financial/invoices/:id`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Informações completas
- [ ] Itens da fatura
- [ ] Impostos
- [ ] Visualização de XML (NFe)
- [ ] Download de PDF
- [ ] Envio por email
- [ ] Ações (emitir, cancelar, reenviar)

##### 5.3 Criar/Emitir Fatura (`/financial/invoices/create`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Formulário completo
- [ ] Seleção de ordens de serviço
- [ ] Cálculo automático de impostos
- [ ] Validação de dados fiscais
- [ ] Preview antes de emitir
- [ ] Integração com emissor de NFe
- [ ] Geração de PDF

#### 6. Categorias Financeiras

##### 6.1 Gestão de Categorias (`/financial/categories`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Lista de categorias
- [ ] Hierarquia de categorias
- [ ] Criar/editar categoria
- [ ] Cores e ícones
- [ ] Orçamento por categoria
- [ ] Relatórios por categoria

#### 7. Contas Bancárias

##### 7.1 Gestão de Contas (`/financial/accounts`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Lista de contas bancárias
- [ ] Criar/editar conta
- [ ] Saldo atualizado
- [ ] Histórico de movimentações
- [ ] Reconciliação bancária
- [ ] Importação de extratos
- [ ] Integração bancária (Open Banking)

#### 8. Relatórios Financeiros

##### 8.1 Relatório de Fluxo de Caixa (`/financial/reports/cash-flow`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Projeção de fluxo de caixa
- [ ] Gráficos
- [ ] Filtros por período
- [ ] Exportação

##### 8.2 DRE (Demonstrativo de Resultados) (`/financial/reports/income-statement`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] DRE completo
- [ ] Períodos comparativos
- [ ] Gráficos
- [ ] Exportação

##### 8.3 Balanço Patrimonial (`/financial/reports/balance-sheet`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Balanço completo
- [ ] Ativos e passivos
- [ ] Períodos comparativos
- [ ] Exportação

---

## 🔔 Módulo: Notifications

### Status Atual
- ❌ Não implementado

### Telas e Funcionalidades Necessárias

#### 1. Central de Notificações

##### 1.1 Lista de Notificações (`/notifications`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Lista de notificações
- [ ] Filtros (tipo, status, data)
- [ ] Marcar como lida/não lida
- [ ] Marcar todas como lidas
- [ ] Deletar notificações
- [ ] Agrupamento por data
- [ ] Indicador de não lidas
- [ ] Notificações em tempo real

##### 1.2 Widget de Notificações (Header)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Badge com contador
- [ ] Dropdown com últimas notificações
- [ ] Marcar como lida
- [ ] Link para central completa
- [ ] Atualização em tempo real

#### 2. Configurações de Notificações

##### 2.1 Preferências (`/notifications/settings`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Configuração por tipo de notificação
- [ ] Canais (email, push, SMS, in-app)
- [ ] Frequência
- [ ] Horários
- [ ] Templates personalizados
- [ ] Preferências por módulo

#### 3. Tipos de Notificações

**Notificações do Sistema:**
- [ ] Nova ordem de serviço atribuída
- [ ] Ordem de serviço atualizada
- [ ] Ordem de serviço vencendo
- [ ] Ordem de serviço vencida
- [ ] Pagamento recebido
- [ ] Conta a receber vencendo
- [ ] Conta a receber vencida
- [ ] Conta a pagar vencendo
- [ ] Conta a pagar vencida
- [ ] Aprovação pendente
- [ ] Novo usuário na empresa
- [ ] Mudança de role
- [ ] Sistema em manutenção
- [ ] Atualizações do sistema

---

## 📊 Módulo: Reports & Analytics

### Status Atual
- ❌ Não implementado

### Telas e Funcionalidades Necessárias

#### 1. Dashboard de Relatórios

##### 1.1 Dashboard Principal (`/reports/dashboard`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Visão geral de KPIs
- [ ] Gráficos interativos
- [ ] Filtros globais
- [ ] Comparação de períodos
- [ ] Exportação
- [ ] Agendamento de relatórios
- [ ] Widgets personalizáveis

#### 2. Relatórios de Service Order

##### 2.1 Relatório de Performance (`/reports/service-orders/performance`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Tempo médio de execução
- [ ] Taxa de conclusão
- [ ] Ordens por status
- [ ] Ordens por prioridade
- [ ] Performance por técnico
- [ ] Performance por cliente
- [ ] Gráficos e tabelas
- [ ] Exportação

##### 2.2 Relatório de Produtividade (`/reports/service-orders/productivity`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Ordens por período
- [ ] Produtividade por técnico
- [ ] Produtividade por departamento
- [ ] Horas trabalhadas
- [ ] Comparação de períodos
- [ ] Gráficos

##### 2.3 Relatório de Satisfação (`/reports/service-orders/satisfaction`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Avaliações de clientes
- [ ] NPS (Net Promoter Score)
- [ ] Comentários
- [ ] Tendências
- [ ] Gráficos

#### 3. Relatórios Financeiros

##### 3.1 Relatório de Receita (`/reports/financial/revenue`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Receita por período
- [ ] Receita por cliente
- [ ] Receita por categoria
- [ ] Tendências
- [ ] Projeções
- [ ] Gráficos

##### 3.2 Relatório de Despesas (`/reports/financial/expenses`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Despesas por período
- [ ] Despesas por categoria
- [ ] Despesas por fornecedor
- [ ] Comparação com orçamento
- [ ] Gráficos

#### 4. Relatórios de Usuários

##### 4.1 Relatório de Atividades (`/reports/users/activities`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Atividades por usuário
- [ ] Login/logout
- [ ] Ações realizadas
- [ ] Tempo de uso
- [ ] Exportação

#### 5. Relatórios Customizados

##### 5.1 Construtor de Relatórios (`/reports/custom/create`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Interface drag-and-drop
- [ ] Seleção de dados
- [ ] Filtros
- [ ] Agrupamentos
- [ ] Visualizações (tabela, gráfico, card)
- [ ] Salvar relatório
- [ ] Compartilhar relatório
- [ ] Agendar relatório

##### 5.2 Meus Relatórios (`/reports/custom`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Lista de relatórios salvos
- [ ] Executar relatório
- [ ] Editar relatório
- [ ] Duplicar relatório
- [ ] Compartilhar relatório
- [ ] Deletar relatório

#### 6. Exportação e Agendamento

##### 6.1 Exportação
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Exportar para PDF
- [ ] Exportar para Excel
- [ ] Exportar para CSV
- [ ] Exportar para imagem
- [ ] Configurações de exportação

##### 6.2 Agendamento
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Agendar relatório
- [ ] Frequência (diário, semanal, mensal)
- [ ] Destinatários
- [ ] Formato de exportação
- [ ] Gerenciar agendamentos

---

## ⚙️ Módulo: Settings & Configuration

### Status Atual
- ❌ Não implementado (parcialmente em Company Settings)

### Telas e Funcionalidades Necessárias

#### 1. Configurações Gerais

##### 1.1 Configurações do Sistema (`/settings/general`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Informações da empresa
- [ ] Logo e branding
- [ ] Moeda padrão
- [ ] Fuso horário
- [ ] Idioma
- [ ] Formato de data/hora
- [ ] Configurações de negócio

##### 1.2 Configurações de Segurança (`/settings/security`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Política de senhas
- [ ] Sessões (timeout, múltiplas sessões)
- [ ] Autenticação de dois fatores
- [ ] IPs permitidos/bloqueados
- [ ] Logs de segurança
- [ ] Backup e restauração

##### 1.3 Configurações de Notificações (`/settings/notifications`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Preferências globais
- [ ] Canais habilitados
- [ ] Templates de notificação
- [ ] Configurações por tipo

##### 1.4 Configurações de Integrações (`/settings/integrations`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Integrações disponíveis
- [ ] Configuração de APIs
- [ ] Webhooks
- [ ] Tokens de acesso
- [ ] Histórico de sincronizações

#### 2. Configurações de Workflow

##### 2.1 Estados Customizados (`/settings/workflows/states`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Criar estados customizados
- [ ] Editar estados
- [ ] Definir transições
- [ ] Regras de transição
- [ ] Aprovações obrigatórias

##### 2.2 Templates (`/settings/workflows/templates`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Gestão de templates
- [ ] Categorias
- [ ] Variáveis

#### 3. Configurações de Permissões

##### 3.1 Matriz de Permissões (`/settings/permissions`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Visualização da matriz
- [ ] Edição de permissões
- [ ] Roles customizados
- [ ] Permissões customizadas

#### 4. Auditoria e Logs

##### 4.1 Logs do Sistema (`/settings/audit-logs`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Lista de logs
- [ ] Filtros (usuário, ação, data, módulo)
- [ ] Busca
- [ ] Detalhes do log
- [ ] Exportação
- [ ] Retenção de logs

##### 4.2 Atividades dos Usuários (`/settings/user-activities`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Histórico de atividades
- [ ] Filtros
- [ ] Visualização detalhada

#### 5. Backup e Restauração

##### 5.1 Backup (`/settings/backup`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Criar backup manual
- [ ] Agendar backups
- [ ] Lista de backups
- [ ] Download de backup
- [ ] Restaurar backup
- [ ] Configurações de retenção

---

## 🏠 Módulo: Dashboard & Home

### Status Atual
- ✅ Home básica

### Telas e Funcionalidades Necessárias

#### 1. Dashboard Principal

##### 1.1 Home/Dashboard (`/`)
**Status:** ✅ Implementado (básico)  
**Funcionalidades:**
- [x] Visão geral básica
- [ ] KPIs principais (widgets)
- [ ] Gráficos interativos
- [ ] Atividades recentes
- [ ] Notificações importantes
- [ ] Ações rápidas
- [ ] Personalização de widgets
- [ ] Filtros por período
- [ ] Comparação de períodos
- [ ] Exportação
- [ ] Múltiplos dashboards (salvos)

#### 2. Widgets do Dashboard

**Widgets Disponíveis:**
- [ ] Resumo de ordens de serviço
- [ ] Resumo financeiro
- [ ] Gráfico de receita vs despesas
- [ ] Ordens por status (gráfico de pizza)
- [ ] Performance de técnicos
- [ ] Contas a receber/pagar
- [ ] Atividades recentes
- [ ] Notificações
- [ ] Calendário
- [ ] Tarefas pendentes
- [ ] Métricas customizadas

#### 3. Personalização

##### 3.1 Personalizar Dashboard (`/dashboard/customize`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Adicionar/remover widgets
- [ ] Reordenar widgets (drag & drop)
- [ ] Configurar widgets
- [ ] Salvar layout
- [ ] Múltiplos layouts
- [ ] Resetar para padrão

---

## 📱 Funcionalidades Transversais

### 1. Busca Global

##### 1.1 Busca (`/search`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Busca unificada
- [ ] Busca por tipo (ordens, clientes, transações, etc.)
- [ ] Sugestões enquanto digita
- [ ] Filtros na busca
- [ ] Histórico de buscas
- [ ] Buscas salvas
- [ ] Atalho de teclado (Ctrl+K)

### 2. Upload e Gestão de Arquivos

##### 2.1 Gestor de Arquivos (`/files`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Upload de arquivos
- [ ] Organização em pastas
- [ ] Preview de arquivos
- [ ] Download
- [ ] Compartilhamento
- [ ] Versionamento
- [ ] Quota de armazenamento
- [ ] Integração com cloud storage

### 3. Calendário

##### 3.1 Calendário (`/calendar`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Visualização mensal/semanal/diária
- [ ] Eventos (ordens agendadas, vencimentos)
- [ ] Criar evento
- [ ] Editar evento
- [ ] Integração com Google Calendar
- [ ] Exportação
- [ ] Lembretes

### 4. Atividades e Timeline

##### 4.1 Timeline Global (`/activity`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Timeline de todas as atividades
- [ ] Filtros (tipo, usuário, data, módulo)
- [ ] Busca
- [ ] Agrupamento
- [ ] Exportação

### 5. Ajuda e Suporte

##### 5.1 Central de Ajuda (`/help`)
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] Documentação
- [ ] Tutoriais
- [ ] FAQ
- [ ] Vídeos
- [ ] Busca na ajuda
- [ ] Contato com suporte
- [ ] Chat de suporte

### 6. Mobile App

##### 6.1 App Mobile
**Status:** ❌ Não implementado  
**Funcionalidades:**
- [ ] App nativo (iOS/Android)
- [ ] Sincronização offline
- [ ] Notificações push
- [ ] Câmera para fotos
- [ ] Assinatura digital
- [ ] GPS para localização
- [ ] Modo offline

---

## 🎯 Priorização

### Fase 1: Essencial (MVP Corporacional)
**Prazo estimado:** 2-3 meses

#### Identity & Access
- [ ] Gestão completa de usuários
- [ ] Gestão de roles e permissões
- [ ] 2FA básico

#### Organization
- [ ] Gestão completa de empresas
- [ ] Gestão de departamentos

#### Service Order
- [ ] Filtros avançados
- [ ] Visualizações alternativas (Kanban)
- [ ] Anexos e comentários
- [ ] Templates

#### Financial
- [ ] Contas a receber
- [ ] Contas a pagar
- [ ] Faturas básicas
- [ ] Categorias

#### Dashboard
- [ ] Dashboard completo com KPIs
- [ ] Widgets personalizáveis

#### Notifications
- [ ] Sistema básico de notificações
- [ ] Preferências básicas

### Fase 2: Importante (Sistema Completo)
**Prazo estimado:** 3-4 meses

#### Reports & Analytics
- [ ] Relatórios principais
- [ ] Dashboard de relatórios
- [ ] Exportação

#### Settings
- [ ] Configurações completas
- [ ] Auditoria e logs
- [ ] Backup

#### Funcionalidades Transversais
- [ ] Busca global
- [ ] Upload de arquivos
- [ ] Calendário

### Fase 3: Avançado (Diferenciação)
**Prazo estimado:** 2-3 meses

#### Integrações
- [ ] Integrações com sistemas externos
- [ ] APIs públicas
- [ ] Webhooks

#### Mobile
- [ ] App mobile básico

#### IA e Automação
- [ ] Sugestões inteligentes
- [ ] Automação de workflows
- [ ] Análise preditiva

---

## 📊 Métricas de Sucesso

### Funcionalidades por Módulo

| Módulo | Total | Implementado | Pendente | % Completo |
|--------|-------|--------------|----------|------------|
| Identity & Access | 25 | 4 | 21 | 16% |
| Organization | 15 | 4 | 11 | 27% |
| Service Order | 35 | 8 | 27 | 23% |
| Financial | 40 | 4 | 36 | 10% |
| Notifications | 10 | 0 | 10 | 0% |
| Reports & Analytics | 20 | 0 | 20 | 0% |
| Settings | 15 | 1 | 14 | 7% |
| Dashboard | 10 | 1 | 9 | 10% |
| Transversais | 15 | 0 | 15 | 0% |
| **TOTAL** | **185** | **22** | **163** | **12%** |

---

## 📝 Notas de Implementação

### Ordem Recomendada de Desenvolvimento

1. **Completar módulos existentes** (Service Order, Financial básico)
2. **Identity & Access completo** (base para tudo)
3. **Notifications básico** (melhora UX)
4. **Reports principais** (valor para negócio)
5. **Settings completo** (necessário para produção)
6. **Funcionalidades transversais** (melhora produtividade)
7. **Mobile e integrações** (diferenciação)

### Considerações Técnicas

- Todas as telas devem ser responsivas
- Implementar lazy loading de rotas
- Cache de dados frequentes
- Paginação em todas as listas
- Filtros salvos (localStorage ou backend)
- Exportação assíncrona para grandes volumes
- Notificações em tempo real (WebSocket)
- Suporte offline básico (PWA)

---

**Última atualização:** 2026  
**Próxima revisão:** Após conclusão da Fase 1

