import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { Company } from "../../domain/entities/company";
import { UserId } from "@modules/identity-access/domain/value-objects/user-id";

export interface CreateCompanyInput {
  name: string;
  ownerId: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export class CreateCompanyUseCase extends BaseUseCase<
  CreateCompanyInput,
  Company
> {
  constructor(private readonly repository: CompanyRepository) {
    super();
  }

  async execute(input: CreateCompanyInput): Promise<Result<Company>> {
    try {
      // Criar Value Objects
      const ownerId = UserId.create(input.ownerId);

      // Verificar se o documento já está em uso (se fornecido)
      if (input.document) {
        const documentExists = await this.repository.findByDocument(
          input.document
        );
        if (documentExists) {
          return this.failure("Document already in use");
        }
      }

      // Criar Aggregate
      const company = Company.create(
        input.name,
        ownerId,
        input.document || null,
        input.email || null,
        input.phone || null,
        input.address || null,
        input.city || null,
        input.state || null,
        input.zipCode || null
      );

      // Persistir
      await this.repository.save(company);

      return this.success(company);
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to create company"
      );
    }
  }
}

