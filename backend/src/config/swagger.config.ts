import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

/**
 * Configuração do Swagger/OpenAPI
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("ServiCore API")
    .setDescription(
      "API do ServiCore - Sistema de gestão de ordens de serviço. " +
        "Desenvolvido com DDD + Arquitetura Hexagonal + CQRS Light."
    )
    .setVersion("1.0")
    .addTag("health", "Endpoints de health check")
    .addTag("service-orders", "Gestão de ordens de serviço")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .addServer("http://localhost:3000", "Desenvolvimento")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "ServiCore API Documentation",
    customfavIcon: "/favicon.ico",
    customCss: ".swagger-ui .topbar { display: none }",
  });
}

