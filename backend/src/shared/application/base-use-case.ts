import { Result } from "./result";
import { IUseCase } from "./interfaces/use-case.interface";

/**
 * Base Use Case
 *
 * Classe base abstrata para todos os Use Cases (Write Side).
 * Fornece funcionalidades comuns e padroniza o uso do Result Pattern.
 *
 * @template TInput Tipo dos dados de entrada
 * @template TOutput Tipo dos dados de saída (normalmente uma entidade de domínio)
 */
export abstract class BaseUseCase<TInput, TOutput> implements IUseCase<
  TInput,
  Result<TOutput>
> {
  /**
   * Executa o caso de uso
   * @param input Dados de entrada
   * @returns Result contendo sucesso ou falha
   */
  abstract execute(input: TInput): Promise<Result<TOutput>>;

  /**
   * Método auxiliar para criar um Result de sucesso
   * @param value Valor de sucesso
   * @returns Result de sucesso
   */
  protected success(value: TOutput): Result<TOutput> {
    return Result.ok(value);
  }

  /**
   * Método auxiliar para criar um Result de falha
   * @param error Mensagem de erro
   * @returns Result de falha
   */
  protected failure(error: string): Result<TOutput> {
    return Result.fail(error);
  }
}
