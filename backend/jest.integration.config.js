/** @type {import('jest').Config} */
const baseConfig = require("./jest.config.js");

module.exports = {
  ...baseConfig,
  displayName: "integration",
  testMatch: [
    "**/__tests__/**/*.integration.ts",
    "**/?(*.)+(spec|test).integration.ts",
  ],
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/jest.integration.setup.js"],
};


