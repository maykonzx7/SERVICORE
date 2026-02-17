/**
 * Pagination DTO
 *
 * DTO compartilhado para paginação de resultados
 */
export class PaginationDto {
  /**
   * Número da página (começa em 1)
   */
  page: number;

  /**
   * Quantidade de itens por página
   */
  limit: number;

  /**
   * Total de itens disponíveis
   */
  total?: number;

  /**
   * Total de páginas
   */
  totalPages?: number;

  constructor(page: number = 1, limit: number = 10) {
    this.page = page > 0 ? page : 1;
    this.limit = limit > 0 ? limit : 10;
  }

  /**
   * Calcula o offset para queries SQL
   */
  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  /**
   * Calcula o total de páginas baseado no total de itens
   */
  calculateTotalPages(totalItems: number): number {
    return Math.ceil(totalItems / this.limit);
  }
}
