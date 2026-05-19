import { prisma } from '../lib/prisma.js'
import type { User } from '../types/index.js'

type UserRow = Omit<User, 'password_hash'>

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

export async function findAllUsers(
  page: number,
  limit: number,
): Promise<{ rows: UserRow[]; total: number }> {
  const offset = (page - 1) * limit
  const where = { deletedAt: null } as const

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: { id: true, email: true, fullName: true, isActive: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
  ])

  const rows: UserRow[] = users.map((u) => ({
    id: u.id,
    email: u.email,
    full_name: u.fullName,
    is_active: u.isActive,
    created_at: u.createdAt,
    updated_at: u.updatedAt,
  }))

  return { rows, total }
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

export async function updateUser(
  id: number,
  fields: { full_name?: string; email?: string; is_active?: boolean },
): Promise<boolean> {
  if (Object.keys(fields).length === 0) return false

  const data: { fullName?: string; email?: string; isActive?: boolean } = {}
  if (fields.full_name !== undefined) data.fullName = fields.full_name
  if (fields.email !== undefined) data.email = fields.email
  if (fields.is_active !== undefined) data.isActive = fields.is_active

  const result = await prisma.user.updateMany({ where: { id, deletedAt: null }, data })
  return result.count > 0
}

export async function softDeleteUser(id: number): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { email: true },
  })
  if (!user) return false

  await prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      email: `deleted_${id}_${user.email}`,
    },
  })
  return true
}

export async function getUserRoles(userId: number): Promise<string[]> {
  const rows = await prisma.userRole.findMany({
    where: { userId },
    select: { role: { select: { name: true } } },
  })
  return rows.map((r) => r.role.name)
}

export async function assignRoleToUser(userId: number, roleId: number): Promise<void> {
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId } },
    create: { userId, roleId },
    update: {},
  })
}

export async function removeRoleFromUser(userId: number, roleId: number): Promise<boolean> {
  const result = await prisma.userRole.deleteMany({ where: { userId, roleId } })
  return result.count > 0
}

export async function anonymizeDeletedEmail(email: string): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: { not: null } },
    select: { id: true },
  })
  if (!user) return
  await prisma.user.update({
    where: { id: user.id },
    data: { email: `deleted_${user.id}_${email}` },
  })
}

export async function emailExists(email: string, excludeId?: number): Promise<boolean> {
  const where = excludeId !== undefined
    ? { email, deletedAt: null, id: { not: excludeId } }
    : { email, deletedAt: null }

  const user = await prisma.user.findFirst({ where, select: { id: true } })
  return user !== null
}
