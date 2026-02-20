// Carregar variáveis de ambiente
import * as dotenv from "dotenv";
dotenv.config();

// Registrar path aliases antes de qualquer import
import "./register-paths";

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { setupSwagger } from "./config/swagger.config";

/**
 * Bootstrap da aplicação NestJS
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Habilitar CORS com configuração específica para desenvolvimento
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  app.enableCors({
    origin: isDevelopment 
      ? true // Em desenvolvimento, permitir todas as origens
      : process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Configurar Swagger apenas em desenvolvimento
  if (process.env.NODE_ENV !== "production") {
    setupSwagger(app);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
