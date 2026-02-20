<template>
  <div class="general-settings">
    <h2 class="section-title">Configurações Gerais</h2>
    <p class="section-description">
      Gerencie as configurações gerais da empresa e do sistema.
    </p>

    <Card>
      <div class="settings-form">
        <div class="form-group">
          <label class="form-label">Nome da Empresa</label>
          <Input v-model="form.companyName" placeholder="Nome da empresa" />
        </div>

        <div class="form-group">
          <label class="form-label">Logo</label>
          <div class="logo-upload">
            <div v-if="logoPreview" class="logo-preview">
              <img :src="logoPreview" alt="Logo" />
              <button class="remove-logo" @click="removeLogo">×</button>
            </div>
            <div v-else class="logo-placeholder">
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="handleLogoUpload"
                style="display: none"
              />
              <button class="upload-btn" @click="$refs.fileInput?.click()">
                Upload Logo
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Moeda Padrão</label>
          <Select
            v-model="form.currency"
            :options="currencyOptions"
            placeholder="Selecione a moeda"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Fuso Horário</label>
          <Select
            v-model="form.timezone"
            :options="timezoneOptions"
            placeholder="Selecione o fuso horário"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Idioma</label>
          <Select
            v-model="form.language"
            :options="languageOptions"
            placeholder="Selecione o idioma"
          />
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
import Select from '@/shared/components/ui/Select.vue'
import Button from '@/shared/components/ui/Button.vue'

const form = ref({
  companyName: '',
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
  language: 'pt-BR',
})

const logoPreview = ref<string | null>(null)
const saving = ref(false)

const currencyOptions = [
  { value: 'BRL', label: 'Real Brasileiro (R$)' },
  { value: 'USD', label: 'Dólar Americano ($)' },
  { value: 'EUR', label: 'Euro (€)' },
]

const timezoneOptions = [
  { value: 'America/Sao_Paulo', label: 'America/São Paulo (GMT-3)' },
  { value: 'America/Manaus', label: 'America/Manaus (GMT-4)' },
  { value: 'America/Rio_Branco', label: 'America/Rio Branco (GMT-5)' },
]

const languageOptions = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' },
]

function handleLogoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function removeLogo() {
  logoPreview.value = null
}

async function handleSave() {
  saving.value = true
  try {
    // TODO: Implementar chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('Configurações salvas com sucesso!')
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
.general-settings {
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.logo-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-preview {
  position: relative;
  width: 8rem;
  height: 8rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.remove-logo {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
}

.logo-placeholder {
  width: 8rem;
  height: 8rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.upload-btn:hover {
  background: #2563eb;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>

