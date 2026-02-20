import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { Company } from "../../domain/entities/company";

export interface ListCompaniesInput {
  page?: number;
  limit?: number;
  search?: string;
  ownerId?: string;
  active?: boolean;
  document?: string;
  sortBy?: "name" | "createdAt" | "document";
  sortOrder?: "asc" | "desc";
}

export interface ListCompaniesOutput {
  companies: Company[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ListCompaniesUseCase extends BaseUseCase<
  ListCompaniesInput,
  ListCompaniesOutput
> {
  constructor(private readonly repository: CompanyRepository) {
    super();
  }

  async execute(
    input: ListCompaniesInput
  ): Promise<Result<ListCompaniesOutput>> {
    try {
      const result = await this.repository.findMany({
        page: input.page,
        limit: input.limit,
        search: input.search,
        ownerId: input.ownerId,
        active: input.active,
        document: input.document,
        sortBy: input.sortBy,
        sortOrder: input.sortOrder,
      });

      return this.success({
        companies: result.companies,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to list companies"
      );
    }
  }
}

