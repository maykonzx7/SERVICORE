/**
 * Jest E2E Setup
 *
 * Configurações específicas para testes end-to-end
 */

// Configurar ambiente de teste E2E
process.env.NODE_ENV = "test";
process.env.PORT = process.env.PORT || "3001";

// Timeout maior para testes E2E
jest.setTimeout(60000);


