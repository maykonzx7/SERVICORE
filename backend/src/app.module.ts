import { Module } from "@nestjs/common";
import { ServiceOrderModule } from "./modules/service-order/service-order.module";

/**
 * AppModule
 *
 * Módulo raiz da aplicação NestJS.
 * Registra todos os módulos de domínio.
 */
@Module({
  imports: [ServiceOrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
