import { IQuery } from "./interfaces/query.interface";

/**
 * Base Query
 *
 * Classe base abstrata para todas as Queries (Read Side).
 * Fornece funcionalidades comuns para consultas.
 *
 * @template TInput Tipo dos dados de entrada (filtros, paginação, etc.)
 * @template TOutput Tipo dos dados de saída (normalmente um DTO)
 */
export abstract class BaseQuery<TInput, TOutput> implements IQuery<
  TInput,
  TOutput
> {
  /**
   * Executa a query
   * @param input Dados de entrada (filtros, paginação, etc.)
   * @returns Resultado da consulta
   */
  abstract execute(input: TInput): Promise<TOutput>;
}
