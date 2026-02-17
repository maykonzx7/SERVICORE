import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // ========== STATE ==========
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sidebarOpen = ref(true)

  // ========== GETTERS ==========
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // ========== ACTIONS ==========
  function setLoading(value: boolean) {
    loading.value = value
  }

  function setError(message: string | null) {
    error.value = message
  }

  function clearError() {
    error.value = null
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setSidebarOpen(value: boolean) {
    sidebarOpen.value = value
  }

  // ========== RETURN ==========
  return {
    // State
    loading,
    error,
    sidebarOpen,
    // Getters
    isLoading,
    hasError,
    // Actions
    setLoading,
    setError,
    clearError,
    toggleSidebar,
    setSidebarOpen,
  }
})

