import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { Company } from "../../domain/entities/company";
import { CompanyId } from "../../domain/value-objects/company-id";

export interface GetCompanyByIdInput {
  id: string;
}

export class GetCompanyByIdUseCase extends BaseUseCase<
  GetCompanyByIdInput,
  Company
> {
  constructor(private readonly repository: CompanyRepository) {
    super();
  }

  async execute(input: GetCompanyByIdInput): Promise<Result<Company>> {
    try {
      const companyId = CompanyId.create(input.id);
      const company = await this.repository.findById(companyId);

      if (!company) {
        return this.failure("Company not found");
      }

      return this.success(company);
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to get company"
      );
    }
  }
}

