import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function fixCompanyTable() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not set. Please check your .env file.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Corrigindo tabela Company...');
    
    // Adicionar valor padrão para updatedAt se não tiver
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Company" 
      ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
    `);

    // Criar trigger para atualizar updatedAt automaticamente
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS update_company_updated_at ON "Company";
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER update_company_updated_at
      BEFORE UPDATE ON "Company"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Tabela Company corrigida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao corrigir tabela:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixCompanyTable();

