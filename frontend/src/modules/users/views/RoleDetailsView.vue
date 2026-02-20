<template>
  <DashboardLayout>
    <div class="role-details-view">
      <div class="role-details-header">
        <Button variant="outline" @click="goBack">← Voltar</Button>
        <h1 class="role-details-title">{{ roleData?.role || role }}</h1>
      </div>

      <p v-if="errorMessage" class="role-details-error">{{ errorMessage }}</p>

      <div v-if="loading" class="loading">Carregando detalhes do role...</div>

      <div v-else-if="roleData" class="role-details-content">
        <div class="role-info-card">
          <h2 class="section-title">Informações do Role</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Nome:</span>
              <span class="info-value">{{ roleData.role }}</span>
            </div>
            <div v-if="roleData.description" class="info-item">
              <span class="info-label">Descrição:</span>
              <span class="info-value">{{ roleData.description }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total de Permissões:</span>
              <span class="info-value">{{ roleData.permissions.length }}</span>
            </div>
          </div>
        </div>

        <div class="permissions-card">
          <h2 class="section-title">Permissões</h2>
          <div class="permissions-list">
            <div
              v-for="permission in roleData.permissions"
              :key="permission"
              class="permission-item"
            >
              <span class="permission-resource">{{ getResource(permission) }}</span>
              <span class="permission-separator">:</span>
              <span class="permission-action">{{ getAction(permission) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import { rolesPermissionsApi } from '../api/roles-permissions.api'
import type { RolePermissions } from '../types/roles-permissions.types'

const route = useRoute()
const router = useRouter()
const role = route.params.role as string
const loading = ref(false)
const errorMessage = ref<string>('')
const roleData = ref<RolePermissions | null>(null)

onMounted(async () => {
  await loadRoleDetails()
})

async function loadRoleDetails() {
  loading.value = true
  errorMessage.value = ''

  try {
    roleData.value = await rolesPermissionsApi.getRolePermissions(role)
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Falha ao carregar detalhes do role'
  } finally {
    loading.value = false
  }
}

function getResource(permission: string): string {
  return permission.split(':')[0]
}

function getAction(permission: string): string {
  return permission.split(':')[1]
}

function goBack() {
  router.push({ name: 'Roles' })
}
</script>

<style scoped>
.role-details-view {
  max-width: 90rem;
  margin: 0 auto;
}

.role-details-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.role-details-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.role-details-error {
  margin: 0 0 1rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.role-details-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.role-info-card,
.permissions-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.section-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #111827;
}

.permissions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.permission-resource {
  color: #3b82f6;
  font-weight: 600;
}

.permission-separator {
  color: #6b7280;
}

.permission-action {
  color: #059669;
  font-weight: 500;
}

@media (max-width: 768px) {
  .permissions-list {
    grid-template-columns: 1fr;
  }
}
</style>

