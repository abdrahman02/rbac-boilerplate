import { prisma } from '../lib/prisma.js'

export async function testConnection(): Promise<void> {
  await prisma.$connect()
}
