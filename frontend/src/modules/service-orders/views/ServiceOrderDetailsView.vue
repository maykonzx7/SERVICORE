<template>
  <div class="service-order-details">
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!currentOrder" class="empty">Ordem de serviço não encontrada</div>
    <div v-else class="order-details">
      <div class="header">
        <button @click="$router.back()" class="btn-back">← Voltar</button>
        <h1>Ordem de Serviço #{{ currentOrder.id.slice(0, 8) }}</h1>
      </div>

      <div class="details-card">
        <div class="detail-row">
          <label>Status:</label>
          <span :class="['status-badge', getStatusClass(currentOrder.status)]">
            {{ getStatusLabel(currentOrder.status) }}
          </span>
        </div>

        <div class="detail-row">
          <label>Company ID:</label>
          <span>{{ currentOrder.companyId }}</span>
        </div>

        <div class="detail-row">
          <label>Descrição:</label>
          <p>{{ currentOrder.description }}</p>
        </div>

        <div class="detail-row">
          <label>Prioridade:</label>
          <span :class="['priority', getPriorityClass(currentOrder.priority)]">
            {{ getPriorityLabel(currentOrder.priority) }}
          </span>
        </div>

        <div class="detail-row">
          <label>Valor:</label>
          <span class="value">R$ {{ formatCurrency(currentOrder.value) }}</span>
        </div>

        <div class="detail-row">
          <label>Criada em:</label>
          <span>{{ formatDate(currentOrder.createdAt) }}</span>
        </div>
      </div>

      <div class="actions">
        <button
          v-if="canStart"
          @click="handleStart"
          :disabled="loading"
          class="btn-action btn-start"
        >
          Iniciar
        </button>
        <button
          v-if="canComplete"
          @click="handleComplete"
          :disabled="loading"
          class="btn-action btn-complete"
        >
          Finalizar
        </button>
        <button
          v-if="canCancel"
          @click="handleCancel"
          :disabled="loading"
          class="btn-action btn-cancel"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useServiceOrderStore } from "../stores/service-order.store";

const route = useRoute();
const store = useServiceOrderStore();

const currentOrder = computed(() => store.currentOrder);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

const canStart = computed(() => {
  return currentOrder.value?.status === "CREATED";
});

const canComplete = computed(() => {
  return (
    currentOrder.value?.status === "STARTED" ||
    currentOrder.value?.status === "IN_PROGRESS"
  );
});

const canCancel = computed(() => {
  return (
    currentOrder.value?.status === "CREATED" ||
    currentOrder.value?.status === "STARTED"
  );
});

const loadOrder = async () => {
  const id = route.params.id as string;
  try {
    await store.loadOrderById(id);
  } catch (err) {
    // Erro já está no store
  }
};

const handleStart = async () => {
  if (!currentOrder.value) return;
  try {
    await store.startOrder(currentOrder.value.id);
  } catch (err) {
    // Erro já está no store
  }
};

const handleComplete = async () => {
  if (!currentOrder.value) return;
  try {
    await store.completeOrder(currentOrder.value.id);
  } catch (err) {
    // Erro já está no store
  }
};

const handleCancel = async () => {
  if (!currentOrder.value) return;
  if (confirm("Tem certeza que deseja cancelar esta ordem de serviço?")) {
    try {
      await store.cancelOrder(currentOrder.value.id);
    } catch (err) {
      // Erro já está no store
    }
  }
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    CREATED: "Criada",
    STARTED: "Iniciada",
    IN_PROGRESS: "Em Progresso",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
  };
  return labels[status] || status;
};

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    CREATED: "status-created",
    STARTED: "status-started",
    IN_PROGRESS: "status-in-progress",
    COMPLETED: "status-completed",
    CANCELLED: "status-cancelled",
  };
  return classes[status] || "";
};

const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
    CRITICAL: "Crítica",
  };
  return labels[priority] || priority;
};

const getPriorityClass = (priority: string): string => {
  return `priority-${priority.toLowerCase()}`;
};

const formatCurrency = (value: number): string => {
  return value.toFixed(2).replace(".", ",");
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  loadOrder();
});
</script>

<style scoped>
.service-order-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading,
.empty,
.error {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  border-radius: 4px;
  padding: 15px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.btn-back {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
}

.details-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row label {
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

.detail-row span,
.detail-row p {
  color: #333;
}

.detail-row p {
  margin: 0;
  line-height: 1.6;
}

.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
}

.status-created {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-started {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-in-progress {
  background-color: #e1f5fe;
  color: #0277bd;
}

.status-completed {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-cancelled {
  background-color: #ffebee;
  color: #c62828;
}

.priority {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.priority-low {
  background-color: #e8f5e9;
  color: #388e3c;
}

.priority-medium {
  background-color: #fff3e0;
  color: #f57c00;
}

.priority-high {
  background-color: #ffebee;
  color: #c62828;
}

.priority-critical {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.value {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-action {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: opacity 0.3s;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-start {
  background-color: #42b983;
  color: white;
}

.btn-start:hover:not(:disabled) {
  background-color: #35a372;
}

.btn-complete {
  background-color: #2196f3;
  color: white;
}

.btn-complete:hover:not(:disabled) {
  background-color: #1976d2;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #d32f2f;
}
</style>

