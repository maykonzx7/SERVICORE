/**
 * Use Case Interface
 *
 * Interface base para todos os Use Cases (Write Side).
 * Define o contrato padrão para casos de uso da aplicação.
 *
 * @template TInput Tipo dos dados de entrada
 * @template TOutput Tipo dos dados de saída
 */
export interface IUseCase<TInput, TOutput> {
  /**
   * Executa o caso de uso
   * @param input Dados de entrada
   * @returns Resultado da operação
   */
  execute(input: TInput): Promise<TOutput>;
}
