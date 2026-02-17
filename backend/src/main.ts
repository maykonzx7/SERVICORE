import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

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

  // Habilitar CORS (ajustar conforme necessário)
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
