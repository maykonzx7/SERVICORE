<template>
  <div class="dashboard-layout">
    <Header />
    <div class="dashboard-content">
      <Sidebar v-if="sidebarOpen" />
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/shared/stores/app.store'
import Header from '@/shared/components/layout/Header.vue'
import Sidebar from '@/shared/components/layout/Sidebar.vue'

const appStore = useAppStore()
const sidebarOpen = computed(() => appStore.sidebarOpen)
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

.dashboard-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
</style>

