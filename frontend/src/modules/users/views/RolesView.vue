<template>
  <DashboardLayout>
    <div class="roles-view">
      <div class="roles-header">
        <h1 class="roles-title">Roles e Permissões</h1>
        <div class="header-actions">
          <Button variant="outline" @click="goToPermissions">Ver Todas as Permissões</Button>
          <Button variant="outline" @click="goToMatrix">Ver Matriz</Button>
        </div>
      </div>

      <p v-if="errorMessage" class="roles-error">{{ errorMessage }}</p>

      <div v-if="loading" class="loading">Carregando roles...</div>

      <div v-else class="roles-grid">
        <div
          v-for="role in rolesWithPermissions"
          :key="role.role"
          class="role-card"
          @click="goToRoleDetails(role.role)"
        >
          <div class="role-card-header">
            <h3 class="role-name">{{ role.role }}</h3>
            <span class="permissions-count">{{ role.permissions.length }} permissões</span>
          </div>
          <p v-if="role.description" class="role-description">{{ role.description }}</p>
          <div class="role-permissions-preview">
            <span
              v-for="(permission, index) in role.permissions.slice(0, 3)"
              :key="index"
              class="permission-badge"
            >
              {{ permission }}
            </span>
            <span v-if="role.permissions.length > 3" class="more-permissions">
              +{{ role.permissions.length - 3 }} mais
            </span>
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
import type { RoleWithPermissions } from '../types/roles-permissions.types'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref<string>('')
const rolesWithPermissions = ref<RoleWithPermissions[]>([])

onMounted(async () => {
  await loadRoles()
})

async function loadRoles() {
  loading.value = true
  errorMessage.value = ''

  try {
    const [roles, matrix] = await Promise.all([
      rolesPermissionsApi.listRoles(),
      rolesPermissionsApi.getRolePermissionsMatrix(),
    ])

    rolesWithPermissions.value = roles.map((role) => {
      const roleData = matrix.matrix.find((r) => r.role === role)
      return {
        role,
        permissions: roleData?.permissions || [],
        description: getRoleDescription(role),
      }
    })
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Falha ao carregar roles'
  } finally {
    loading.value = false
  }
}

function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    ADMIN: 'Acesso total ao sistema',
    COMPANY_ADMIN: 'Administrador de uma empresa específica',
    MANAGER: 'Gerente com permissões de gestão',
    TECHNICIAN: 'Técnico que executa serviços',
    CLIENT: 'Cliente que solicita serviços',
    USER: 'Usuário básico do sistema',
  }
  return descriptions[role] || ''
}

function goToRoleDetails(role: string) {
  router.push({
    name: ROUTE_NAMES.ROLE_DETAILS,
    params: { role },
  })
}

function goToPermissions() {
  router.push({ name: ROUTE_NAMES.PERMISSIONS })
}

function goToMatrix() {
  router.push({ name: ROUTE_NAMES.ROLES_MATRIX })
}
</script>

<style scoped>
.roles-view {
  max-width: 90rem;
  margin: 0 auto;
}

.roles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.roles-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.roles-error {
  margin: 0 0 1rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.role-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.role-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.role-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.role-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.permissions-count {
  font-size: 0.875rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.role-description {
  margin: 0 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.role-permissions-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.permission-badge {
  font-size: 0.75rem;
  color: #3b82f6;
  background: #dbeafe;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.more-permissions {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 768px) {
  .roles-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }
}
</style>

