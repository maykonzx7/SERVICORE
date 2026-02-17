<template>
  <DashboardLayout>
    <div class="company-settings-view">
      <h1 class="company-settings-title">Configurações da Empresa</h1>
      <div v-if="loading" class="company-settings-loading">
        Carregando configurações...
      </div>
      <div v-else class="company-settings-content">
        <p class="company-settings-note">
          Configurações organizacionais serão implementadas em breve.
        </p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'

const route = useRoute()
const loading = ref(false)

onMounted(() => {
  // TODO: Carregar configurações quando implementado
})
</script>

<style scoped>
.company-settings-view {
  max-width: 64rem;
  margin: 0 auto;
}

.company-settings-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 2rem 0;
}

.company-settings-loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.company-settings-note {
  padding: 2rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  color: #6b7280;
  text-align: center;
}
</style>

