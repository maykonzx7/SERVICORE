<template>
  <div class="security-settings">
    <h2 class="section-title">Configurações de Segurança</h2>
    <p class="section-description">
      Gerencie as configurações de segurança da empresa e políticas de acesso.
    </p>

    <Card>
      <div class="settings-form">
        <h3 class="subsection-title">Política de Senhas</h3>
        
        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.passwordPolicy.requireUppercase" />
            Exigir letras maiúsculas
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.passwordPolicy.requireLowercase" />
            Exigir letras minúsculas
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.passwordPolicy.requireNumbers" />
            Exigir números
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.passwordPolicy.requireSpecialChars" />
            Exigir caracteres especiais
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">Tamanho mínimo da senha</label>
          <Input
            v-model.number="form.passwordPolicy.minLength"
            type="number"
            min="6"
            max="32"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Dias para expiração da senha</label>
          <Input
            v-model.number="form.passwordPolicy.expirationDays"
            type="number"
            min="0"
            placeholder="0 = nunca expira"
          />
        </div>

        <h3 class="subsection-title">Sessões</h3>

        <div class="form-group">
          <label class="form-label">Timeout de sessão (minutos)</label>
          <Input
            v-model.number="form.sessions.timeout"
            type="number"
            min="5"
            placeholder="30"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.sessions.allowMultiple" />
            Permitir múltiplas sessões simultâneas
          </label>
        </div>

        <h3 class="subsection-title">Autenticação de Dois Fatores</h3>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="form.twoFactor.required" />
            Exigir 2FA para todos os usuários
          </label>
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
import { ref } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'

const form = ref({
  passwordPolicy: {
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    minLength: 8,
    expirationDays: 90,
  },
  sessions: {
    timeout: 30,
    allowMultiple: true,
  },
  twoFactor: {
    required: false,
  },
})

const saving = ref(false)

async function handleSave() {
  saving.value = true
  try {
    // TODO: Implementar chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('Configurações de segurança salvas com sucesso!')
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
.security-settings {
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
  margin: 1rem 0 0.5rem 0;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.subsection-title:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
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

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>

