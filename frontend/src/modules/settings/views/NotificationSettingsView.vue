<template>
  <div class="notification-settings">
    <h2 class="section-title">Configurações de Notificações</h2>
    <p class="section-description">
      Configure como e quando você deseja receber notificações.
    </p>

    <Card>
      <div class="settings-form">
        <h3 class="subsection-title">Canais de Notificação</h3>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.channels.email" />
            Email
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.channels.push" />
            Notificações Push
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.channels.sms" />
            SMS
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.channels.inApp" />
            Notificações no App
          </label>
        </div>

        <h3 class="subsection-title">Tipos de Notificação</h3>

        <div
          v-for="type in notificationTypes"
          :key="type.id"
          class="notification-type-group"
        >
          <div class="type-header">
            <h4 class="type-title">{{ type.label }}</h4>
            <span class="type-description">{{ type.description }}</span>
          </div>
          <div class="type-channels">
            <label class="channel-option">
              <input
                type="checkbox"
                v-model="form.types[type.id].email"
                :disabled="!form.channels.email"
              />
              Email
            </label>
            <label class="channel-option">
              <input
                type="checkbox"
                v-model="form.types[type.id].push"
                :disabled="!form.channels.push"
              />
              Push
            </label>
            <label class="channel-option">
              <input
                type="checkbox"
                v-model="form.types[type.id].sms"
                :disabled="!form.channels.sms"
              />
              SMS
            </label>
            <label class="channel-option">
              <input
                type="checkbox"
                v-model="form.types[type.id].inApp"
                :disabled="!form.channels.inApp"
              />
              No App
            </label>
          </div>
        </div>

        <div class="form-actions">
          <Button @click="handleSave" :loading="saving">
            Salvar Alterações
          </Button>
          <Button variant="outline" @click="handleReset">
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const notificationTypes = [
  {
    id: 'service-order',
    label: 'Ordens de Serviço',
    description: 'Notificações sobre ordens de serviço',
  },
  {
    id: 'financial',
    label: 'Financeiro',
    description: 'Notificações sobre transações e pagamentos',
  },
  {
    id: 'user',
    label: 'Usuários',
    description: 'Notificações sobre usuários e permissões',
  },
  {
    id: 'system',
    label: 'Sistema',
    description: 'Notificações do sistema',
  },
]

const form = ref({
  channels: {
    email: true,
    push: true,
    sms: false,
    inApp: true,
  },
  types: computed(() => {
    const types: Record<string, { email: boolean; push: boolean; sms: boolean; inApp: boolean }> = {}
    notificationTypes.forEach((type) => {
      types[type.id] = {
        email: true,
        push: true,
        sms: false,
        inApp: true,
      }
    })
    return types
  }),
})

const saving = ref(false)

async function handleSave() {
  saving.value = true
  try {
    // TODO: Implementar chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('Configurações de notificações salvas com sucesso!')
  } catch (error) {
    alert('Erro ao salvar configurações')
  } finally {
    saving.value = false
  }
}

function handleReset() {
  // TODO: Resetar formulário
}
</script>

<style scoped>
.notification-settings {
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

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.subsection-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}

.notification-type-group {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.type-header {
  margin-bottom: 0.75rem;
}

.type-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.type-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.type-channels {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.channel-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.channel-option input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}

.channel-option input[type="checkbox"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>

