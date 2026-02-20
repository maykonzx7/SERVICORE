import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { organizationApi } from '@/modules/organization/api/organization.api'
import type { Company } from '@/modules/organization/types/organization.types'

export const useCompanyStore = defineStore('company', () => {
  // ========== STATE ==========
  const currentCompany = ref<Company | null>(null)
  const companies = ref<Company[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== GETTERS ==========
  const companyId = computed(() => currentCompany.value?.id || null)
  const hasCompany = computed(() => currentCompany.value !== null)
  const companyName = computed(() => currentCompany.value?.name || '')

  // ========== ACTIONS ==========
  function setCurrentCompany(company: Company) {
    currentCompany.value = company
    // Persistir no localStorage
    localStorage.setItem('currentCompanyId', company.id)
  }

  async function loadCurrentCompany() {
    const storedCompanyId = localStorage.getItem('currentCompanyId')
    if (storedCompanyId) {
      loading.value = true
      error.value = null
      try {
        const response = await organizationApi.getCompanyById(storedCompanyId)
        setCurrentCompany(response.data)
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Erro ao carregar empresa'
        // Se empresa não encontrada, limpar
        if (err.response?.status === 404) {
          clearCompany()
        }
      } finally {
        loading.value = false
      }
    }
  }

  async function loadCompanies() {
    loading.value = true
    error.value = null
    try {
      const response = await organizationApi.listCompanies()
      // Garantir que sempre seja um array
      const companiesData = response.data
      companies.value = Array.isArray(companiesData) ? companiesData : []
      
      // Se o usuário tem apenas uma empresa, selecionar automaticamente
      if (companies.value.length === 1 && !currentCompany.value) {
        setCurrentCompany(companies.value[0])
      }
      
      // Se já tem empresa selecionada, verificar se ainda existe na lista
      if (currentCompany.value && companies.value.length > 0) {
        const companyStillExists = companies.value.some(
          (c) => c.id === currentCompany.value?.id
        )
        if (!companyStillExists) {
          // Empresa selecionada não existe mais
          // Se houver apenas uma empresa disponível, selecionar ela
          if (companies.value.length === 1) {
            setCurrentCompany(companies.value[0])
          } else {
            // Múltiplas empresas, limpar seleção para o usuário escolher
            clearCompany()
          }
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar empresas'
      companies.value = [] // Garantir que seja array vazio em caso de erro
      throw err
    } finally {
      loading.value = false
    }
  }

  async function refreshCurrentCompany() {
    if (currentCompany.value) {
      await loadCurrentCompany()
    }
  }

  function clearCompany() {
    currentCompany.value = null
    localStorage.removeItem('currentCompanyId')
  }

  function clearError() {
    error.value = null
  }

  // ========== RETURN ==========
  return {
    // State
    currentCompany,
    companies,
    loading,
    error,
    // Getters
    companyId,
    hasCompany,
    companyName,
    // Actions
    setCurrentCompany,
    loadCurrentCompany,
    loadCompanies,
    refreshCurrentCompany,
    clearCompany,
    clearError,
  }
})

