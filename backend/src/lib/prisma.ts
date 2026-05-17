import { PrismaClient } from '@prisma/client'
import { env } from '../config/env.js'

const url = `mysql://${env.DB_USER}:${encodeURIComponent(env.DB_PASSWORD)}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url } },
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
