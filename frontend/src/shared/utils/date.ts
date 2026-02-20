// Utilitários de data

/**
 * Converte string ISO para Date
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString)
}

/**
 * Formata data relativa (ex: "há 2 horas")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return 'Data inválida'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Verificar se a data é válida
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Data inválida'
  }
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'agora'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `há ${diffInYears} ${diffInYears === 1 ? 'ano' : 'anos'}`
}

/**
 * Verifica se data é hoje
 */
export function isToday(date: string | Date | null | undefined): boolean {
  if (!date) return false
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Verificar se a data é válida
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return false
  }
  
  const today = new Date()
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

/**
 * Adiciona dias a uma data
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Formata data para exibição (ex: "15/01/2024")
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Data inválida'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Verificar se a data é válida
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Data inválida'
  }
  
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Formata hora para exibição (ex: "14:30")
 */
export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return '--:--'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Verificar se a data é válida
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '--:--'
  }
  
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Formata data e hora completa
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'Data inválida'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Verificar se a data é válida
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Data inválida'
  }
  
  return `${formatDate(dateObj)} às ${formatTime(dateObj)}`
}

