/**
 * Result Pattern
 *
 * Padrão para representar o resultado de operações que podem falhar.
 * Evita o uso de exceções para controle de fluxo e torna os erros explícitos.
 *
 * @template T Tipo do valor de sucesso
 */
export class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _error?: string,
    private readonly _value?: T
  ) {}

  /**
   * Cria um Result de sucesso
   * @param value Valor opcional a ser retornado
   * @returns Result de sucesso
   */
  static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, undefined, value);
  }

  /**
   * Cria um Result de falha
   * @param error Mensagem de erro
   * @returns Result de falha
   */
  static fail<T>(error: string): Result<T> {
    return new Result<T>(false, error);
  }

  /**
   * Verifica se o resultado é um sucesso
   */
  get isSuccess(): boolean {
    return this._isSuccess;
  }

  /**
   * Verifica se o resultado é uma falha
   */
  get isFailure(): boolean {
    return !this._isSuccess;
  }

  /**
   * Retorna a mensagem de erro (apenas se for falha)
   * @throws Error se chamado em um Result de sucesso
   */
  get error(): string {
    if (this._isSuccess) {
      throw new Error("Cannot get error from a successful result");
    }
    return this._error!;
  }

  /**
   * Retorna o valor (apenas se for sucesso)
   * @throws Error se chamado em um Result de falha
   */
  get value(): T {
    if (!this._isSuccess) {
      throw new Error("Cannot get value from a failed result");
    }
    return this._value!;
  }

  /**
   * Executa uma função se o resultado for sucesso
   * @param fn Função a ser executada com o valor
   * @returns O mesmo Result (para encadeamento)
   */
  onSuccess(fn: (value: T) => void): Result<T> {
    if (this._isSuccess) {
      fn(this._value!);
    }
    return this;
  }

  /**
   * Executa uma função se o resultado for falha
   * @param fn Função a ser executada com o erro
   * @returns O mesmo Result (para encadeamento)
   */
  onFailure(fn: (error: string) => void): Result<T> {
    if (!this._isSuccess) {
      fn(this._error!);
    }
    return this;
  }

  /**
   * Transforma o valor do Result se for sucesso
   * @param fn Função de transformação
   * @returns Novo Result com o valor transformado
   */
  map<U>(fn: (value: T) => U): Result<U> {
    if (this._isSuccess) {
      return Result.ok(fn(this._value!));
    }
    return Result.fail<U>(this._error!);
  }

  /**
   * Transforma o Result usando uma função que retorna outro Result
   * @param fn Função que retorna um Result
   * @returns Novo Result
   */
  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this._isSuccess) {
      return fn(this._value!);
    }
    return Result.fail<U>(this._error!);
  }
}
