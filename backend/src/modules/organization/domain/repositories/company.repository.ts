import { Company } from "../entities/company";
import { CompanyId } from "../value-objects/company-id";
import { UserId } from "@modules/identity-access/domain/value-objects/user-id";

/**
 * CompanyRepository
 *
 * Interface do repositório de empresas.
 * Define os contratos para persistência de dados de empresas.
 */
export interface CompanyRepository {
  /**
   * Salva uma empresa (cria ou atualiza)
   * @param company Empresa a ser salva
   * @returns Promise<void>
   */
  save(company: Company): Promise<void>;

  /**
   * Busca uma empresa por ID
   * @param id ID da empresa
   * @returns Promise<Company | null>
   */
  findById(id: CompanyId): Promise<Company | null>;

  /**
   * Busca empresas por proprietário
   * @param ownerId ID do proprietário
   * @returns Promise<Company[]>
   */
  findByOwnerId(ownerId: UserId): Promise<Company[]>;

  /**
   * Busca empresa por documento (CPF/CNPJ)
   * @param document Documento da empresa
   * @returns Promise<Company | null>
   */
  findByDocument(document: string): Promise<Company | null>;

  /**
   * Lista empresas com paginação e filtros
   * @param params Parâmetros de busca
   * @returns Promise com lista paginada de empresas
   */
  findMany(params: {
    page?: number;
    limit?: number;
    search?: string;
    ownerId?: string;
    active?: boolean;
  }): Promise<{
    companies: Company[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}

