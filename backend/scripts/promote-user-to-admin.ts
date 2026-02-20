/**
 * Script para promover um usuário a ADMIN
 * 
 * Uso: npm run promote-admin <email>
 * Exemplo: npm run promote-admin maykonzx7@gmail.com
 */

// Carregar variáveis de ambiente
import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('❌ DATABASE_URL não encontrada no arquivo .env')
  process.exit(1)
}

const pool = new Pool({ connectionString: databaseUrl })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

async function promoteUserToAdmin(email: string) {
  try {
    console.log(`Buscando usuário com email: ${email}...`)
    
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ Usuário com email ${email} não encontrado!`)
      process.exit(1)
    }

    console.log(`✅ Usuário encontrado: ${user.name || user.email}`)
    console.log(`   Roles atuais: ${user.roles.join(', ')}`)

    // Verificar se já é ADMIN
    if (user.roles.includes('ADMIN')) {
      console.log(`ℹ️  Usuário já possui role ADMIN`)
      await prisma.$disconnect()
      return
    }

    // Adicionar role ADMIN (mantendo os roles existentes)
    const updatedRoles = [...new Set([...user.roles, 'ADMIN'])]
    
    console.log(`Atualizando roles para: ${updatedRoles.join(', ')}...`)

    await prisma.user.update({
      where: { email },
      data: {
        roles: updatedRoles,
      },
    })

    console.log(`✅ Usuário ${email} promovido a ADMIN com sucesso!`)
    console.log(`   Novos roles: ${updatedRoles.join(', ')}`)
  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Obter email dos argumentos da linha de comando
const email = process.argv[2]

if (!email) {
  console.error('❌ Por favor, forneça o email do usuário')
  console.log('Uso: npm run promote-admin <email>')
  console.log('Exemplo: npm run promote-admin maykonzx7@gmail.com')
  process.exit(1)
}

promoteUserToAdmin(email)

