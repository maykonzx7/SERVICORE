import { Module } from "@nestjs/common";
import { PrismaService } from "./shared/infrastructure/prisma.service";
import { ServiceOrderModule } from "./modules/service-order/service-order.module";
import { HealthController } from "./shared/presentation/health.controller";

/**
 * AppModule
 *
 * Módulo raiz da aplicação NestJS.
 * Registra todos os módulos de domínio.
 */
@Module({
  imports: [ServiceOrderModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
