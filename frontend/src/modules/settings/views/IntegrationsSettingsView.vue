<template>
  <div class="integrations-settings">
    <h2 class="section-title">Integrações</h2>
    <p class="section-description">
      Gerencie integrações com serviços externos e APIs.
    </p>

    <div class="integrations-list">
      <Card v-for="integration in integrations" :key="integration.id">
        <div class="integration-item">
          <div class="integration-header">
            <div class="integration-info">
              <h3 class="integration-name">{{ integration.name }}</h3>
              <p class="integration-description">{{ integration.description }}</p>
            </div>
            <Badge
              :variant="integration.enabled ? 'success' : 'gray'"
            >
              {{ integration.enabled ? 'Ativo' : 'Inativo' }}
            </Badge>
          </div>
          <div class="integration-actions">
            <Button
              v-if="!integration.enabled"
              @click="enableIntegration(integration.id)"
            >
              Ativar
            </Button>
            <Button
              v-else
              variant="outline"
              @click="configureIntegration(integration.id)"
            >
              Configurar
            </Button>
            <Button
              v-if="integration.enabled"
              variant="outline"
              @click="disableIntegration(integration.id)"
            >
              Desativar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Badge from '@/shared/components/ui/Badge.vue'

interface Integration {
  id: string
  name: string
  description: string
  enabled: boolean
}

const integrations = ref<Integration[]>([
  {
    id: 'webhook',
    name: 'Webhooks',
    description: 'Configure webhooks para receber notificações em tempo real',
    enabled: false,
  },
  {
    id: 'api',
    name: 'API REST',
    description: 'Acesse os dados do sistema através da API REST',
    enabled: true,
  },
  {
    id: 'email',
    name: 'Email SMTP',
    description: 'Configure servidor SMTP para envio de emails',
    enabled: false,
  },
])

function enableIntegration(id: string) {
  const integration = integrations.value.find((i) => i.id === id)
  if (integration) {
    integration.enabled = true
  }
}

function disableIntegration(id: string) {
  const integration = integrations.value.find((i) => i.id === id)
  if (integration) {
    integration.enabled = false
  }
}

function configureIntegration(id: string) {
  // TODO: Abrir modal de configuração
  alert(`Configurar integração: ${id}`)
}
</script>

<style scoped>
.integrations-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.section-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.integrations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.integration-item {
  padding: 1.5rem;
}

.integration-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.integration-info {
  flex: 1;
}

.integration-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.integration-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.integration-actions {
  display: flex;
  gap: 0.75rem;
}
</style>

