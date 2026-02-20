import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './shared/stores/auth.store'
import { useCompanyStore } from './shared/stores/company.store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Tratamento de erros global
app.config.errorHandler = (err, instance, info) => {
  // Ignorar erros 404 de endpoints que ainda não foram implementados
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosError = err as any
    if (axiosError.response?.status === 404) {
      // Endpoints que ainda não existem no backend - não mostrar erro
      const url = axiosError.config?.url || ''
      const ignoredEndpoints = [
        '/notifications/unread-count',
        '/notifications',
        '/transactions',
        '/service-orders',
        '/history',
        '/balance',
        '/summary',
      ]
      
      // Verificar padrões mais específicos (ex: /service-orders/:id/history)
      const ignoredPatterns = [
        /\/service-orders\/[^/]+\/history/,
      ]
      
      const matchesPattern = ignoredPatterns.some(pattern => pattern.test(url))
      
      if (ignoredEndpoints.some(endpoint => url.includes(endpoint)) || matchesPattern) {
        // Silenciar esses erros - são esperados até que o backend seja implementado
        return
      }
    }
  }
  
  // Logar outros erros normalmente
  console.error('Erro global:', err)
  console.error('Info:', info)
  console.error('Instance:', instance)
}

// Carregar estado inicial das stores
const authStore = useAuthStore()
const companyStore = useCompanyStore()

authStore.loadFromStorage()
companyStore.loadCurrentCompany()

app.mount('#app')

