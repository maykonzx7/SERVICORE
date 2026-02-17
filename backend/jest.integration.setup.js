/**
 * Jest Integration Setup
 *
 * Configurações específicas para testes de integração
 */

// Configurar banco de dados de teste
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test_db";

// Timeout maior para testes de integração
jest.setTimeout(30000);


