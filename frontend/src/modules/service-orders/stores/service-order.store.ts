import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  serviceOrderApi,
  type CreateServiceOrderDto,
  type ServiceOrderResponse,
  type PaginatedResponse,
} from "@/shared/api/service-order.api";

export const useServiceOrderStore = defineStore("serviceOrder", () => {
  // State
  const orders = ref<ServiceOrderResponse[]>([]);
  const currentOrder = ref<ServiceOrderResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Getters
  const hasOrders = computed(() => orders.value.length > 0);
  const isLoading = computed(() => loading.value);

  // Actions
  async function createOrder(data: CreateServiceOrderDto) {
    loading.value = true;
    error.value = null;
    try {
      const response = await serviceOrderApi.create(data);
      orders.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao criar ordem de serviço";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadOrders(companyId: string, page: number = 1, limit: number = 10) {
    loading.value = true;
    error.value = null;
    try {
      const response = await serviceOrderApi.list(companyId, page, limit);
      const result: PaginatedResponse<ServiceOrderResponse> = response.data;
      orders.value = result.data;
      pagination.value = {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao carregar ordens de serviço";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadOrderById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await serviceOrderApi.getById(id);
      currentOrder.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao carregar ordem de serviço";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function startOrder(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await serviceOrderApi.start(id);
      updateOrderInList(response.data);
      if (currentOrder.value?.id === id) {
        currentOrder.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao iniciar ordem de serviço";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function completeOrder(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await serviceOrderApi.complete(id);
      updateOrderInList(response.data);
      if (currentOrder.value?.id === id) {
        currentOrder.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao finalizar ordem de serviço";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function cancelOrder(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await serviceOrderApi.cancel(id);
      updateOrderInList(response.data);
      if (currentOrder.value?.id === id) {
        currentOrder.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao cancelar ordem de serviço";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function updateOrderInList(updatedOrder: ServiceOrderResponse) {
    const index = orders.value.findIndex((o) => o.id === updatedOrder.id);
    if (index !== -1) {
      orders.value[index] = updatedOrder;
    }
  }

  function clearError() {
    error.value = null;
  }

  function reset() {
    orders.value = [];
    currentOrder.value = null;
    error.value = null;
    pagination.value = {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    pagination,
    // Getters
    hasOrders,
    isLoading,
    // Actions
    createOrder,
    loadOrders,
    loadOrderById,
    startOrder,
    completeOrder,
    cancelOrder,
    clearError,
    reset,
  };
});

