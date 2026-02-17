/**
 * Register Path Aliases
 *
 * Este arquivo deve ser importado antes de qualquer outro módulo
 * para garantir que os path aliases do TypeScript funcionem corretamente
 * com ts-node-dev.
 */
import { register } from "tsconfig-paths";
import * as path from "path";

const basePath = path.resolve(__dirname, "..");
register({
  baseUrl: basePath,
  paths: {
    "@shared/*": ["src/shared/*"],
    "@modules/*": ["src/modules/*"],
  },
});

