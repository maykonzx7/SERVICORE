<template>
  <Card>
    <div class="chart-widget">
      <div class="chart-header">
        <h3 class="chart-title">{{ title }}</h3>
        <div v-if="subtitle" class="chart-subtitle">{{ subtitle }}</div>
      </div>
      <div class="chart-content">
        <div v-if="loading" class="chart-loading">
          <Loading />
        </div>
        <div v-else-if="error" class="chart-error">
          {{ error }}
        </div>
        <div v-else class="chart-placeholder">
          <slot>
            <p class="chart-placeholder-text">Gráfico será implementado aqui</p>
          </slot>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Loading from '@/shared/components/ui/Loading.vue'

interface Props {
  title: string
  subtitle?: string
  loading?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>

<style scoped>
.chart-widget {
  padding: 1.5rem;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.chart-content {
  min-height: 12rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-loading,
.chart-error {
  padding: 2rem;
  text-align: center;
}

.chart-error {
  color: #dc2626;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder-text {
  color: #9ca3af;
  font-size: 0.875rem;
}
</style>

