<template>
  <form @submit.prevent="handleSubmit" class="service-order-form">
    <div class="form-group">
      <label for="companyId">Company ID</label>
      <input
        id="companyId"
        v-model="form.companyId"
        type="text"
        placeholder="Digite o ID da empresa"
        required
      />
    </div>

    <div class="form-group">
      <label for="description">Descrição</label>
      <textarea
        id="description"
        v-model="form.description"
        placeholder="Descreva a ordem de serviço"
        rows="4"
        required
      />
    </div>

    <div class="form-group">
      <label for="priority">Prioridade</label>
      <select id="priority" v-model="form.priority" required>
        <option value="LOW">Baixa</option>
        <option value="MEDIUM">Média</option>
        <option value="HIGH">Alta</option>
        <option value="CRITICAL">Crítica</option>
      </select>
    </div>

    <div class="form-group">
      <label for="value">Valor (R$)</label>
      <input
        id="value"
        v-model.number="form.value"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        required
      />
    </div>

    <div class="form-actions">
      <button type="submit" :disabled="loading || !isFormValid">
        {{ loading ? "Criando..." : "Criar Ordem de Serviço" }}
      </button>
      <button type="button" @click="resetForm" :disabled="loading">
        Limpar
      </button>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useServiceOrderStore } from "../stores/service-order.store";
import type { CreateServiceOrderDto } from "@/shared/api/service-order.api";

const store = useServiceOrderStore();

const form = ref<CreateServiceOrderDto>({
  companyId: "",
  description: "",
  priority: "MEDIUM",
  value: 0,
});

const error = computed(() => store.error);
const loading = computed(() => store.loading);

const isFormValid = computed(() => {
  return (
    form.value.companyId.trim() !== "" &&
    form.value.description.trim() !== "" &&
    form.value.priority !== "" &&
    form.value.value > 0
  );
});

const handleSubmit = async () => {
  try {
    await store.createOrder(form.value);
    resetForm();
    // Emitir evento de sucesso se necessário
  } catch (err) {
    // Erro já está no store
  }
};

const resetForm = () => {
  form.value = {
    companyId: "",
    description: "",
    priority: "MEDIUM",
    value: 0,
  };
  store.clearError();
};
</script>

<style scoped>
.service-order-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-actions button[type="submit"] {
  background-color: #42b983;
  color: white;
}

.form-actions button[type="submit"]:hover:not(:disabled) {
  background-color: #35a372;
}

.form-actions button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.form-actions button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.form-actions button[type="button"]:hover:not(:disabled) {
  background-color: #5a6268;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}
</style>

