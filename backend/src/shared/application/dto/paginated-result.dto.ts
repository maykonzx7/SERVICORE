import { PaginationDto } from "./pagination.dto";

/**
 * Paginated Result DTO
 *
 * DTO para resultados paginados
 *
 * @template T Tipo dos itens da lista
 */
export class PaginatedResultDto<T> {
  /**
   * Lista de itens da página atual
   */
  data: T[];

  /**
   * Informações de paginação
   */
  pagination: PaginationDto;

  constructor(data: T[], pagination: PaginationDto) {
    this.data = data;
    this.pagination = pagination;

    if (pagination.total !== undefined) {
      this.pagination.totalPages = pagination.calculateTotalPages(
        pagination.total
      );
    }
  }
}
