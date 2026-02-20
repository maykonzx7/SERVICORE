<template>
  <DashboardLayout>
    <div class="permissions-view">
      <div class="permissions-header">
        <Button variant="outline" @click="goBack">← Voltar</Button>
        <h1 class="permissions-title">Todas as Permissões</h1>
      </div>

      <p v-if="errorMessage" class="permissions-error">{{ errorMessage }}</p>

      <div v-if="loading" class="loading">Carregando permissões...</div>

      <div v-else-if="permissionsData" class="permissions-content">
        <div class="permissions-summary">
          <p class="summary-text">
            Total de <strong>{{ permissionsData.permissions.length }}</strong> permissões únicas
            agrupadas em <strong>{{ Object.keys(permissionsData.groupedByResource).length }}</strong> recursos
          </p>
        </div>

        <div class="permissions-groups">
          <div
            v-for="(actions, resource) in permissionsData.groupedByResource"
            :key="resource"
            class="permission-group-card"
          >
            <h3 class="resource-name">{{ resource }}</h3>
            <div class="actions-list">
              <span
                v-for="action in actions"
                :key="action"
                class="action-badge"
              >
                {{ action }}
              </span>
            </div>
            <div class="permissions-list">
              <span
                v-for="action in actions"
                :key="`${resource}:${action}`"
                class="permission-badge"
              >
                {{ resource }}:{{ action }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import { rolesPermissionsApi } from '../api/roles-permissions.api'
import type { AllPermissions } from '../types/roles-permissions.types'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref<string>('')
const permissionsData = ref<AllPermissions | null>(null)

onMounted(async () => {
  await loadPermissions()
})

async function loadPermissions() {
  loading.value = true
  errorMessage.value = ''

  try {
    permissionsData.value = await rolesPermissionsApi.listAllPermissions()
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Falha ao carregar permissões'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push({ name: 'Roles' })
}
</script>

<style scoped>
.permissions-view {
  max-width: 90rem;
  margin: 0 auto;
}

.permissions-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.permissions-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.permissions-error {
  margin: 0 0 1rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.permissions-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.permissions-summary {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.summary-text {
  margin: 0;
  color: #374151;
  font-size: 0.875rem;
}

.permissions-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.permission-group-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.resource-name {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #3b82f6;
  text-transform: capitalize;
}

.actions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.action-badge {
  font-size: 0.75rem;
  color: #059669;
  background: #d1fae5;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.permission-badge {
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

@media (max-width: 768px) {
  .permissions-groups {
    grid-template-columns: 1fr;
  }
}
</style>

