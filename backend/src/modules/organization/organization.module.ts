import { Module } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { CompanyController } from "./presentation/controllers/company.controller";
import { CompanyRepository } from "./domain/repositories/company.repository";
import { PrismaCompanyRepository } from "./infrastructure/persistence/prisma-company.repository";
import { CreateCompanyUseCase } from "./application/use-cases/create-company.usecase";
import { UpdateCompanyUseCase } from "./application/use-cases/update-company.usecase";
import { GetCompanyByIdUseCase } from "./application/use-cases/get-company-by-id.usecase";
import { ListCompaniesUseCase } from "./application/use-cases/list-companies.usecase";
import { GetCompanyStatisticsUseCase } from "./application/use-cases/get-company-statistics.usecase";

/**
 * OrganizationModule
 *
 * Módulo de organização (empresas, departamentos, etc.)
 */
@Module({
  controllers: [CompanyController],
  providers: [
    // Infrastructure
    PrismaService,
    {
      provide: "CompanyRepository",
      useClass: PrismaCompanyRepository,
    },
    // Use Cases
    {
      provide: CreateCompanyUseCase,
      useFactory: (repository: CompanyRepository) => {
        return new CreateCompanyUseCase(repository);
      },
      inject: ["CompanyRepository"],
    },
    {
      provide: UpdateCompanyUseCase,
      useFactory: (repository: CompanyRepository) => {
        return new UpdateCompanyUseCase(repository);
      },
      inject: ["CompanyRepository"],
    },
    {
      provide: GetCompanyByIdUseCase,
      useFactory: (repository: CompanyRepository) => {
        return new GetCompanyByIdUseCase(repository);
      },
      inject: ["CompanyRepository"],
    },
    {
      provide: ListCompaniesUseCase,
      useFactory: (repository: CompanyRepository) => {
        return new ListCompaniesUseCase(repository);
      },
      inject: ["CompanyRepository"],
    },
    {
      provide: GetCompanyStatisticsUseCase,
      useFactory: (repository: CompanyRepository, prisma: PrismaService) => {
        return new GetCompanyStatisticsUseCase(repository, prisma);
      },
      inject: ["CompanyRepository", PrismaService],
    },
  ],
  exports: ["CompanyRepository"],
})
export class OrganizationModule {}

