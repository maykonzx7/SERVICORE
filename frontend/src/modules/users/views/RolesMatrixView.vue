<template>
  <DashboardLayout>
    <div class="roles-matrix-view">
      <div class="matrix-header">
        <Button variant="outline" @click="goBack">← Voltar</Button>
        <h1 class="matrix-title">Matriz de Roles x Permissões</h1>
      </div>

      <p v-if="errorMessage" class="matrix-error">{{ errorMessage }}</p>

      <div v-if="loading" class="loading">Carregando matriz...</div>

      <div v-else-if="matrixData" class="matrix-content">
        <div class="matrix-table-wrapper">
          <table class="matrix-table">
            <thead>
              <tr>
                <th class="role-column">Role</th>
                <th
                  v-for="permission in matrixData.allPermissions"
                  :key="permission"
                  class="permission-column"
                  :title="permission"
                >
                  {{ getAction(permission) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="roleData in matrixData.matrix" :key="roleData.role">
                <td class="role-cell">
                  <strong>{{ roleData.role }}</strong>
                </td>
                <td
                  v-for="permission in matrixData.allPermissions"
                  :key="permission"
                  class="permission-cell"
                  :class="{
                    'has-permission': roleData.permissions.includes(permission),
                  }"
                >
                  <span v-if="roleData.permissions.includes(permission)" class="check-mark">
                    ✓
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="matrix-legend">
          <div class="legend-item">
            <span class="legend-check">✓</span>
            <span>Role possui esta permissão</span>
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
import type { RolePermissionsMatrix } from '../types/roles-permissions.types'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref<string>('')
const matrixData = ref<RolePermissionsMatrix | null>(null)

onMounted(async () => {
  await loadMatrix()
})

async function loadMatrix() {
  loading.value = true
  errorMessage.value = ''

  try {
    matrixData.value = await rolesPermissionsApi.getRolePermissionsMatrix()
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Falha ao carregar matriz'
  } finally {
    loading.value = false
  }
}

function getAction(permission: string): string {
  return permission.split(':')[1]
}

function goBack() {
  router.push({ name: 'Roles' })
}
</script>

<style scoped>
.roles-matrix-view {
  max-width: 100%;
  margin: 0 auto;
  overflow-x: auto;
}

.matrix-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.matrix-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.matrix-error {
  margin: 0 0 1rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.matrix-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.matrix-table-wrapper {
  overflow-x: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.matrix-table thead {
  background: #f9fafb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.matrix-table th {
  padding: 0.75rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.role-column {
  min-width: 150px;
  position: sticky;
  left: 0;
  background: #f9fafb;
  z-index: 5;
}

.permission-column {
  min-width: 80px;
  text-align: center;
  font-size: 0.7rem;
}

.matrix-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}

.role-cell {
  position: sticky;
  left: 0;
  background: white;
  z-index: 1;
  font-weight: 500;
}

.permission-cell {
  background: #fee2e2;
}

.permission-cell.has-permission {
  background: #d1fae5;
}

.check-mark {
  color: #059669;
  font-weight: bold;
  font-size: 1.125rem;
}

.matrix-legend {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-check {
  color: #059669;
  font-weight: bold;
  font-size: 1.125rem;
}
</style>

