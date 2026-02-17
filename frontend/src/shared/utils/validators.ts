// Validadores de formulário

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida CNPJ
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length !== 14) return false
  
  // Validação básica de CNPJ
  if (/^(\d)\1+$/.test(cleaned)) return false
  
  // TODO: Implementar validação completa de CNPJ com dígitos verificadores
  return true
}

/**
 * Valida se string não está vazia
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Valida se número é positivo
 */
export function isPositive(value: number): boolean {
  return value >= 0
}

/**
 * Valida se valor está dentro de um range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Valida se string tem tamanho mínimo
 */
export function hasMinLength(value: string, min: number): boolean {
  return value.length >= min
}

/**
 * Valida se string tem tamanho máximo
 */
export function hasMaxLength(value: string, max: number): boolean {
  return value.length <= max
}

