import { Company } from "../../domain/entities/company";
import { Prisma } from "@prisma/client";

/**
 * CompanyMapper
 *
 * Responsável por converter entre a camada de domínio e a camada de persistência.
 */
export class CompanyMapper {
  /**
   * Converte um Aggregate do domínio para o formato de persistência
   * @param company Aggregate Company
   * @returns Dados no formato do Prisma
   */
  static toPersistence(company: Company): Prisma.CompanyCreateInput {
    return {
      id: company.id.toString(),
      name: company.name,
      document: company.document,
      email: company.email,
      phone: company.phone,
      address: company.address,
      city: company.city,
      state: company.state,
      zipCode: company.zipCode,
      ownerId: company.ownerId.toString(),
      active: company.active,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  /**
   * Converte dados do Prisma para um Aggregate do domínio
   * @param data Dados do Prisma
   * @returns Aggregate Company
   */
  static toDomain(data: {
    id: string;
    name: string;
    document: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    ownerId: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Company {
    return Company.reconstitute(
      data.id,
      data.name,
      data.document,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.state,
      data.zipCode,
      data.ownerId,
      data.active,
      data.createdAt,
      data.updatedAt
    );
  }
}

