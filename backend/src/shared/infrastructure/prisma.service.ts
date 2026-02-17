import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Prisma Service
 *
 * Serviço compartilhado para acesso ao Prisma Client.
 * Gerencia o ciclo de vida da conexão com o banco de dados.
 *
 * Nota: A URL de conexão é lida automaticamente da variável de ambiente
 * DATABASE_URL definida no arquivo .env
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL environment variable is not set. Please check your .env file."
      );
    }
    
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    
    super({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  /**
   * Inicializa a conexão com o banco de dados
   * Chamado automaticamente pelo NestJS quando o módulo é inicializado
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Fecha a conexão com o banco de dados
   * Chamado automaticamente pelo NestJS quando o módulo é destruído
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
