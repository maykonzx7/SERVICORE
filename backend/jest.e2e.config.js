/** @type {import('jest').Config} */
const baseConfig = require("./jest.config.js");

module.exports = {
  ...baseConfig,
  displayName: "e2e",
  testMatch: ["**/__tests__/**/*.e2e.ts", "**/?(*.)+(spec|test).e2e.ts"],
  testTimeout: 60000,
  setupFilesAfterEnv: ["<rootDir>/jest.e2e.setup.js"],
};


