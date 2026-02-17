import { Module } from "@nestjs/common";
import { CompanyController } from "./presentation/controllers/company.controller";

/**
 * OrganizationModule
 *
 * Módulo de organização (empresas, departamentos, etc.)
 * TODO: Implementar módulo completo seguindo DDD
 */
@Module({
  controllers: [CompanyController],
  providers: [],
  exports: [],
})
export class OrganizationModule {}

