<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <button class="header-menu-btn" @click="toggleSidebar">
          <span>☰</span>
        </button>
        <h1 class="header-title">ServiCore</h1>
      </div>
      <div class="header-right">
        <CompanySwitcher v-if="hasCompany" />
        <div class="header-user">
          <span v-if="user">{{ user.email }}</span>
          <Button variant="outline" size="sm" @click="handleLogout">
            Sair
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useCompanyStore } from '@/shared/stores/company.store'
import { useAppStore } from '@/shared/stores/app.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import Button from '@/shared/components/ui/Button.vue'
import CompanySwitcher from '@/modules/organization/components/CompanySwitcher.vue'

const router = useRouter()
const authStore = useAuthStore()
const companyStore = useCompanyStore()
const appStore = useAppStore()

const user = computed(() => authStore.user)
const hasCompany = computed(() => companyStore.hasCompany)

function toggleSidebar() {
  appStore.toggleSidebar()
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  height: 4rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-menu-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.header-menu-btn:hover {
  background-color: #f3f4f6;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>

