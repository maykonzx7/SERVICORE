import { Module } from "@nestjs/common";
import { PrismaService } from "./shared/infrastructure/prisma.service";
import { ServiceOrderModule } from "./modules/service-order/service-order.module";
import { IdentityAccessModule } from "./modules/identity-access/identity-access.module";
import { OrganizationModule } from "./modules/organization/organization.module";
import { FinancialModule } from "./modules/financial/financial.module";
import { HealthController } from "./shared/presentation/health.controller";

/**
 * AppModule
 *
 * Módulo raiz da aplicação NestJS.
 * Registra todos os módulos de domínio.
 */
@Module({
  imports: [
    IdentityAccessModule,
    ServiceOrderModule,
    OrganizationModule,
    FinancialModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
