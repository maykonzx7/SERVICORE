import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { execSync } from 'child_process';

const migrationName = process.argv[2] || 'add_company_model';

try {
  console.log('Executando migração:', migrationName);
  execSync(`npx prisma migrate dev --name ${migrationName}`, {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('✅ Migração executada com sucesso!');
} catch (error) {
  console.error('❌ Erro ao executar migração:', error);
  process.exit(1);
}

