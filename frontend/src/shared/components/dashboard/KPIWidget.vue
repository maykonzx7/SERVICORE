<template>
  <Card :hover="true">
    <div class="kpi-widget">
      <div class="kpi-header">
        <div class="kpi-icon" :class="variant">
          {{ icon }}
        </div>
        <div class="kpi-title">{{ title }}</div>
      </div>
      <div class="kpi-value">{{ formattedValue }}</div>
      <div v-if="subtitle" class="kpi-subtitle">{{ subtitle }}</div>
      <div v-if="trend !== undefined" class="kpi-trend" :class="trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'">
        <span>{{ trend > 0 ? '↑' : trend < 0 ? '↓' : '→' }}</span>
        <span>{{ Math.abs(trend) }}%</span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import { formatMoney } from '@/shared/utils/money'

interface Props {
  title: string
  value: number | string
  icon?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  subtitle?: string
  trend?: number
  format?: 'number' | 'money' | 'percentage'
}

const props = withDefaults(defineProps<Props>(), {
  icon: '📊',
  variant: 'primary',
  format: 'number',
})

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  
  switch (props.format) {
    case 'money':
      return formatMoney(props.value)
    case 'percentage':
      return `${props.value}%`
    default:
      return props.value.toLocaleString('pt-BR')
  }
})
</script>

<style scoped>
.kpi-widget {
  padding: 1.5rem;
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 1.25rem;
}

.kpi-icon.primary {
  background-color: #dbeafe;
}

.kpi-icon.success {
  background-color: #d1fae5;
}

.kpi-icon.warning {
  background-color: #fef3c7;
}

.kpi-icon.danger {
  background-color: #fee2e2;
}

.kpi-icon.info {
  background-color: #e0e7ff;
}

.kpi-title {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.kpi-subtitle {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.kpi-trend.positive {
  color: #059669;
}

.kpi-trend.negative {
  color: #dc2626;
}

.kpi-trend.neutral {
  color: #6b7280;
}
</style>

