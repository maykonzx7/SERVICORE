/**
 * Jest Setup
 *
 * Configurações globais para os testes
 */

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test_db";

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});


