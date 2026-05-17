import { prisma } from '../lib/prisma.js'
import type { User, RefreshToken } from '../types/index.js'

function mapUser(u: {
  id: number
  email: string
  passwordHash: string
  fullName: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}): User {
  return {
    id: u.id,
    email: u.email,
    password_hash: u.passwordHash,
    full_name: u.fullName,
    is_active: u.isActive,
    created_at: u.createdAt,
    updated_at: u.updatedAt,
  }
}

function mapRefreshToken(t: {
  id: number
  userId: number
  tokenHash: string
  expiresAt: Date
  createdAt: Date
  revokedAt: Date | null
}): RefreshToken {
  return {
    id: t.id,
    user_id: t.userId,
    token_hash: t.tokenHash,
    expires_at: t.expiresAt,
    created_at: t.createdAt,
    revoked_at: t.revokedAt,
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findFirst({ where: { email, deletedAt: null } })
  return user ? mapUser(user) : null
}

export async function findUserById(id: number): Promise<User | null> {
  const user = await prisma.user.findFirst({ where: { id, deletedAt: null } })
  return user ? mapUser(user) : null
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
  const token = await prisma.refreshToken.findFirst({
    where: { tokenHash, revokedAt: null },
  })
  return token ? mapRefreshToken(token) : null
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  })
}

export async function revokeAllUserTokens(userId: number): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}
