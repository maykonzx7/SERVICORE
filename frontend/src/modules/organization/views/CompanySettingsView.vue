<template>
  <DashboardLayout>
    <div class="company-settings-view">
      <div class="view-header">
        <h1 class="view-title">Configurações da Empresa</h1>
        <Button variant="outline" @click="goBack">
          Voltar
        </Button>
      </div>

      <div v-if="loading" class="view-loading">
        Carregando configurações...
      </div>

      <div v-else-if="error" class="view-error">
        {{ error }}
        <Button variant="outline" size="sm" @click="loadSettings">
          Tentar Novamente
        </Button>
      </div>

      <div v-else class="view-content">
        <form @submit.prevent="handleSubmit" class="settings-form">
          <div class="settings-section">
            <h2 class="section-title">Configurações Gerais</h2>
            
            <div class="form-row">
              <div class="form-group">
                <label for="currency" class="form-label">Moeda</label>
                <select id="currency" v-model="form.currency">
                  <option value="BRL">BRL - Real Brasileiro</option>
                  <option value="USD">USD - Dólar Americano</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div class="form-group">
                <label for="timezone" class="form-label">Fuso Horário</label>
                <select id="timezone" v-model="form.timezone">
                  <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="dateFormat" class="form-label">Formato de Data</label>
                <select id="dateFormat" v-model="form.dateFormat">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div class="form-group">
                <label for="language" class="form-label">Idioma</label>
                <select id="language" v-model="form.language">
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="errors.general" class="form-error">
            {{ errors.general }}
          </div>

          <div class="form-actions">
            <Button
              type="button"
              variant="outline"
              @click="resetForm"
              :disabled="saving"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              :loading="saving"
              :disabled="!hasChanges"
            >
              Salvar Configurações
            </Button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompanyStore } from '@/shared/stores/company.store'
import { organizationApi } from '../api/organization.api'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import type { OrganizationSettings, UpdateOrganizationSettingsDto } from '../types/organization.types'

const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const settings = ref<OrganizationSettings | null>(null)
const form = ref<UpdateOrganizationSettingsDto>({
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
  dateFormat: 'DD/MM/YYYY',
  language: 'pt-BR',
})
const originalForm = ref<UpdateOrganizationSettingsDto>({ ...form.value })
const errors = ref<Record<string, string>>({})

const hasChanges = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
})

onMounted(async () => {
  await loadSettings()
})

watch(
  () => companyStore.companyId,
  async () => {
    await loadSettings()
  }
)

async function loadSettings() {
  if (!companyStore.companyId) {
    error.value = 'Nenhuma empresa selecionada'
    return
  }

  loading.value = true
  error.value = null
  try {
    const response = await organizationApi.getSettings(companyStore.companyId)
    settings.value = response.data
    form.value = {
      currency: response.data.currency,
      timezone: response.data.timezone,
      dateFormat: response.data.dateFormat,
      language: response.data.language,
    }
    originalForm.value = { ...form.value }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar configurações'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!companyStore.companyId || !settings.value) return

  errors.value = {}
  saving.value = true

  try {
    const response = await organizationApi.updateSettings(
      companyStore.companyId,
      form.value
    )
    settings.value = response.data
    originalForm.value = { ...form.value }
    
    // Atualizar empresa atual se necessário
    if (companyStore.currentCompany) {
      await companyStore.refreshCurrentCompany()
    }
    
    alert('Configurações salvas com sucesso!')
  } catch (err: any) {
    errors.value.general = err.response?.data?.message || 'Erro ao salvar configurações'
  } finally {
    saving.value = false
  }
}

function resetForm() {
  if (settings.value) {
    form.value = {
      currency: settings.value.currency,
      timezone: settings.value.timezone,
      dateFormat: settings.value.dateFormat,
      language: settings.value.language,
    }
  }
  errors.value = {}
}

function goBack() {
  router.push({
    name: ROUTE_NAMES.COMPANY_DETAILS,
    params: { id: companyStore.companyId },
  })
}
</script>

<style scoped>
.company-settings-view {
  max-width: 64rem;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.view-loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.view-error {
  padding: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #991b1b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background: white;
  transition: all 0.2s;
}

.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-error {
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #991b1b;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>
