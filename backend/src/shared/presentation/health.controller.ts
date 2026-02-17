import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PrismaService } from "../infrastructure/prisma.service";

/**
 * Health Check Controller
 *
 * Endpoints para verificação de saúde da aplicação e dependências.
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Health check básico
   * Retorna status da aplicação
   */
  @Get()
  @ApiOperation({ summary: "Health check básico" })
  @ApiResponse({ status: 200, description: "Aplicação está funcionando" })
  async check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    };
  }

  /**
   * Health check completo
   * Verifica saúde da aplicação e todas as dependências
   */
  @Get("detailed")
  @ApiOperation({ summary: "Health check detalhado" })
  @ApiResponse({
    status: 200,
    description: "Status detalhado da aplicação e dependências",
  })
  async detailedCheck() {
    const checks = {
      application: {
        status: "ok",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || "development",
      },
      database: await this.checkDatabase(),
      // Adicionar outras verificações conforme necessário
      // redis: await this.checkRedis(),
      // rabbitmq: await this.checkRabbitMQ(),
    };

    const allHealthy = Object.values(checks).every(
      (check: any) => check.status === "ok"
    );

    return {
      status: allHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  /**
   * Verifica conexão com o banco de dados
   */
  private async checkDatabase(): Promise<{
    status: string;
    responseTime?: number;
    error?: string;
  }> {
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - start;

      return {
        status: "ok",
        responseTime,
      };
    } catch (error: any) {
      return {
        status: "error",
        error: error.message,
      };
    }
  }
}

