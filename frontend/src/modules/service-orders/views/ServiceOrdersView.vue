<template>
  <div class="service-orders-view">
    <div class="header">
      <h1>Ordens de Serviço</h1>
      <button @click="showForm = !showForm" class="btn-primary">
        {{ showForm ? "Cancelar" : "Nova Ordem" }}
      </button>
    </div>

    <ServiceOrderForm v-if="showForm" @created="handleOrderCreated" />

    <div class="filters">
      <input
        v-model="companyIdFilter"
        type="text"
        placeholder="Filtrar por Company ID"
        @input="loadOrders"
      />
      <button @click="loadOrders" :disabled="loading">Atualizar</button>
    </div>

    <div v-if="loading && !hasOrders" class="loading">Carregando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!hasOrders" class="empty">
      Nenhuma ordem de serviço encontrada
    </div>
    <div v-else>
      <div class="orders-list">
        <div
          v-for="order in orders"
          :key="order.id"
          class="order-card"
          @click="goToDetails(order.id)"
        >
          <div class="order-header">
            <span class="order-id">#{{ order.id.slice(0, 8) }}</span>
            <span :class="['status-badge', getStatusClass(order.status)]">
              {{ getStatusLabel(order.status) }}
            </span>
          </div>
          <div class="order-body">
            <p class="description">{{ order.description }}</p>
            <div class="order-meta">
              <span class="priority" :class="getPriorityClass(order.priority)">
                {{ getPriorityLabel(order.priority) }}
              </span>
              <span class="value">R$ {{ formatCurrency(order.value) }}</span>
            </div>
          </div>
          <div class="order-footer">
            <small>{{ formatDate(order.createdAt) }}</small>
          </div>
        </div>
      </div>

      <div v-if="pagination.totalPages > 1" class="pagination">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
        >
          Anterior
        </button>
        <span>
          Página {{ pagination.page }} de {{ pagination.totalPages }}
        </span>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
        >
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useServiceOrderStore } from "../stores/service-order.store";
import ServiceOrderForm from "../components/ServiceOrderForm.vue";

const router = useRouter();
const store = useServiceOrderStore();

const showForm = ref(false);
const companyIdFilter = ref("");

const orders = computed(() => store.orders);
const loading = computed(() => store.loading);
const error = computed(() => store.error);
const hasOrders = computed(() => store.hasOrders);
const pagination = computed(() => store.pagination);

const loadOrders = async () => {
  if (!companyIdFilter.value.trim()) {
    return;
  }
  try {
    await store.loadOrders(
      companyIdFilter.value,
      pagination.value.page,
      pagination.value.limit
    );
  } catch (err) {
    // Erro já está no store
  }
};

const changePage = async (page: number) => {
  if (page < 1 || page > pagination.value.totalPages) return;
  await store.loadOrders(companyIdFilter.value, page, pagination.value.limit);
};

const handleOrderCreated = () => {
  showForm.value = false;
  loadOrders();
};

const goToDetails = (id: string) => {
  router.push(`/service-orders/${id}`);
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
  // Carregar ordens se houver um companyId padrão
  // Por exemplo, de um contexto de autenticação
});
</script>

<style scoped>
.service-orders-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
}

.btn-primary {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #35a372;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filters button {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filters button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.order-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.order-id {
  font-weight: bold;
  color: #2c3e50;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
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

.order-body {
  margin-bottom: 15px;
}

.description {
  margin: 0 0 10px 0;
  color: #555;
  line-height: 1.5;
}

.order-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priority {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
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
  font-weight: bold;
  color: #2c3e50;
  font-size: 16px;
}

.order-footer {
  padding-top: 10px;
  border-top: 1px solid #eee;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.pagination button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

