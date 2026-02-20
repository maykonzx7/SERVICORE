// Utilitários de dinheiro

/**
 * Converte número para centavos (para armazenamento)
 */
export function toCents(value: number): number {
  return Math.round(value * 100)
}

/**
 * Converte centavos para número (para exibição)
 */
export function fromCents(cents: number): number {
  return cents / 100
}

/**
 * Arredonda valor monetário
 */
export function roundMoney(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Soma valores monetários
 */
export function sumMoney(...values: number[]): number {
  return roundMoney(values.reduce((sum, value) => sum + value, 0))
}

/**
 * Formata valor monetário para exibição
 */
export function formatMoney(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value)
}

