/** @type {import('jest').Config} */
const baseConfig = require("./jest.config.js");

module.exports = {
  ...baseConfig,
  displayName: "unit",
  testMatch: [
    "**/__tests__/**/*.spec.ts",
    "**/__tests__/**/*.test.ts",
    "**/?(*.)+(spec|test).ts",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    ".*\\.integration\\.(spec|test)\\.ts$",
    ".*\\.e2e\\.(spec|test)\\.ts$",
  ],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/**/__tests__/**",
    "!src/main.ts",
    "!src/**/*.integration.ts",
    "!src/**/*.e2e.ts",
  ],
};


