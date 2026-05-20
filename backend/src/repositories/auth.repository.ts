import type { RefreshToken, User } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findFirst({ where: { email, deletedAt: null } })
}

export async function findUserById(id: number): Promise<User | null> {
  return prisma.user.findFirst({ where: { id, deletedAt: null } })
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
): Promise<number> {
  const user = await prisma.user.create({
    data: { fullName: name, email, passwordHash },
    select: { id: true },
  })
  return user.id
}

export async function assignDefaultRole(userId: number): Promise<void> {
  const role = await prisma.role.findFirst({
    where: { name: 'user' },
    select: { id: true },
  })
  if (!role) return

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId: role.id } },
    create: { userId, roleId: role.id },
    update: {},
  })
}

export async function getUserRoles(userId: number): Promise<string[]> {
  const rows = await prisma.userRole.findMany({
    where: { userId },
    select: { role: { select: { name: true } } },
  })
  return rows.map((r) => r.role.name)
}

export async function getUserPermissions(userId: number): Promise<string[]> {
  const rows = await prisma.userRole.findMany({
    where: { userId },
    select: {
      role: {
        select: {
          permissions: { select: { permission: { select: { name: true } } } },
        },
      },
    },
  })

  const names = new Set<string>()
  for (const ur of rows) {
    for (const rp of ur.role.permissions) {
      names.add(rp.permission.name)
    }
  }
  return [...names]
}

export async function saveRefreshToken(
  userId: number,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  await prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } })
}

export async function findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
  return prisma.refreshToken.findFirst({ where: { tokenHash, revokedAt: null } })
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  })
}
