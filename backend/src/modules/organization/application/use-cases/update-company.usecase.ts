import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { Company } from "../../domain/entities/company";
import { CompanyId } from "../../domain/value-objects/company-id";

export interface UpdateCompanyInput {
  id: string;
  name?: string;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  active?: boolean;
}

export class UpdateCompanyUseCase extends BaseUseCase<
  UpdateCompanyInput,
  Company
> {
  constructor(private readonly repository: CompanyRepository) {
    super();
  }

  async execute(input: UpdateCompanyInput): Promise<Result<Company>> {
    try {
      const companyId = CompanyId.create(input.id);
      const company = await this.repository.findById(companyId);

      if (!company) {
        return this.failure("Company not found");
      }

      // Verificar se o documento já está em uso por outra empresa (se fornecido)
      if (input.document !== undefined && input.document !== null) {
        const documentExists = await this.repository.findByDocument(
          input.document
        );
        if (documentExists && documentExists.id.toString() !== input.id) {
          return this.failure("Document already in use");
        }
      }

      // Atualizar dados
      company.update(
        input.name,
        input.document,
        input.email,
        input.phone,
        input.address,
        input.city,
        input.state,
        input.zipCode
      );

      // Atualizar status ativo/inativo
      if (input.active !== undefined) {
        if (input.active) {
          company.activate();
        } else {
          company.deactivate();
        }
      }

      // Persistir
      await this.repository.save(company);

      return this.success(company);
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to update company"
      );
    }
  }
}

