<template>
  <Card>
    <div class="history-section">
      <h3 class="section-title">Histórico</h3>

      <div v-if="loading" class="loading-state">
        <Loading />
      </div>

      <div v-else-if="!history || history.length === 0" class="empty-state">
        <p>Nenhum histórico encontrado</p>
      </div>

      <div v-else class="history-list">
        <div
          v-for="entry in history"
          :key="entry.id"
          class="history-item"
        >
          <div class="history-icon">
            <span v-if="entry.action.includes('CREATED')">📝</span>
            <span v-else-if="entry.action.includes('STARTED')">▶️</span>
            <span v-else-if="entry.action.includes('COMPLETED')">✅</span>
            <span v-else-if="entry.action.includes('CANCELLED')">❌</span>
            <span v-else-if="entry.action.includes('ASSIGNED')">👤</span>
            <span v-else>📋</span>
          </div>
          <div class="history-content">
            <div class="history-action">
              <strong>{{ entry.performedByName || entry.performedBy }}</strong>
              <span class="history-action-text">{{ getActionLabel(entry.action) }}</span>
            </div>
            <div v-if="entry.description" class="history-description">
              {{ entry.description }}
            </div>
            <div v-if="entry.changes && Object.keys(entry.changes).length > 0" class="history-changes">
              <div
                v-for="(change, field) in entry.changes"
                :key="field"
                class="change-item"
              >
                <span class="change-field">{{ getFieldLabel(field) }}:</span>
                <span class="change-from">{{ formatChangeValue(change.from) }}</span>
                <span>→</span>
                <span class="change-to">{{ formatChangeValue(change.to) }}</span>
              </div>
            </div>
            <div class="history-time">
              {{ formatDateTime(entry.performedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import { formatDateTime } from '@/shared/utils/formatters'
import type { ServiceOrderHistory } from '../types/service-order.types'

interface Props {
  history?: ServiceOrderHistory[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    'CREATED': 'criou a ordem',
    'STARTED': 'iniciou a ordem',
    'IN_PROGRESS': 'colocou em progresso',
    'PAUSED': 'pausou a ordem',
    'COMPLETED': 'finalizou a ordem',
    'CANCELLED': 'cancelou a ordem',
    'REJECTED': 'rejeitou a ordem',
    'ASSIGNED': 'atribuiu usuário',
    'UNASSIGNED': 'removeu atribuição',
    'UPDATED': 'atualizou a ordem',
  }

  for (const [key, label] of Object.entries(labels)) {
    if (action.includes(key)) {
      return label
    }
  }

  return action
}

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    status: 'Status',
    priority: 'Prioridade',
    value: 'Valor',
    description: 'Descrição',
  }
  return labels[field] || field
}

function formatChangeValue(value: any): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  if (typeof value === 'number') return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  return String(value)
}
</script>

<style scoped>
.history-section {
  padding: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-state p {
  margin: 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 3px solid #3b82f6;
}

.history-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.history-content {
  flex: 1;
}

.history-action {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.history-action strong {
  color: #111827;
  font-weight: 600;
}

.history-action-text {
  color: #6b7280;
}

.history-description {
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.history-changes {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
}

.change-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.change-item:last-child {
  margin-bottom: 0;
}

.change-field {
  font-weight: 500;
  color: #374151;
}

.change-from {
  color: #991b1b;
  text-decoration: line-through;
}

.change-to {
  color: #065f46;
  font-weight: 500;
}

.history-time {
  margin-top: 0.5rem;
  color: #9ca3af;
  font-size: 0.75rem;
}
</style>

