/**
 * Query Interface
 *
 * Interface base para todas as Queries (Read Side).
 * Define o contrato padrão para consultas da aplicação.
 *
 * @template TInput Tipo dos dados de entrada (filtros, paginação, etc.)
 * @template TOutput Tipo dos dados de saída
 */
export interface IQuery<TInput, TOutput> {
  /**
   * Executa a query
   * @param input Dados de entrada (filtros, paginação, etc.)
   * @returns Resultado da consulta
   */
  execute(input: TInput): Promise<TOutput>;
}
