import type { User } from '../generated/prisma/index.js'
import { prisma } from '../lib/prisma.js'

type UserRow = Omit<User, 'passwordHash' | 'deletedAt'>

export async function findAllUsers(
  page: number,
  limit: number,
  search?: string,
  role?: string,
  status?: boolean,
): Promise<{ rows: UserRow[]; total: number }> {
  const fetchAll = limit === -1
  const offset = fetchAll ? 0 : (page - 1) * limit
  const where = {
    deletedAt: null,
    ...(search
      ? { OR: [{ fullName: { contains: search } }, { email: { contains: search } }] }
      : {}),
    ...(role ? { roles: { some: { role: { name: role } } } } : {}),
    ...(status !== undefined ? { isActive: status } : {}),
  }

  const [total, rows] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      ...(fetchAll ? {} : { take: limit }),
    }),
  ])

  return { rows, total }
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

export async function updateUser(
  id: number,
  fields: { fullName?: string; email?: string; isActive?: boolean },
): Promise<boolean> {
  if (Object.keys(fields).length === 0) return false
  const result = await prisma.user.updateMany({ where: { id, deletedAt: null }, data: fields })
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

export async function syncUserRoles(userId: number, roleIds: number[]): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.userRole.deleteMany({ where: { userId } })
    if (roleIds.length > 0) {
      await tx.userRole.createMany({ data: roleIds.map((roleId) => ({ userId, roleId })) })
    }
  })
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
  const where =
    excludeId !== undefined
      ? { email, deletedAt: null, id: { not: excludeId } }
      : { email, deletedAt: null }

  const user = await prisma.user.findFirst({ where, select: { id: true } })
  return user !== null
}

export interface UserExportRow {
  id: number
  fullName: string
  email: string
  isActive: boolean
  roles: string[]
  createdAt: Date
}

export async function findAllUsersForExport(): Promise<UserExportRow[]> {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      fullName: true,
      email: true,
      isActive: true,
      createdAt: true,
      roles: {
        select: { role: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return users.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    isActive: u.isActive,
    roles: u.roles.map((r) => r.role.name),
    createdAt: u.createdAt,
  }))
}

export interface UserFilteredExportParams {
  search?: string
  role?: string
  status?: boolean
}

export async function findUsersForExport(filters: UserFilteredExportParams = {}): Promise<UserExportRow[]> {
  const { search, role, status } = filters
  const where = {
    deletedAt: null,
    ...(search ? { OR: [{ fullName: { contains: search } }, { email: { contains: search } }] } : {}),
    ...(role ? { roles: { some: { role: { name: role } } } } : {}),
    ...(status !== undefined ? { isActive: status } : {}),
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      email: true,
      isActive: true,
      createdAt: true,
      roles: { select: { role: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return users.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    isActive: u.isActive,
    roles: u.roles.map((r) => r.role.name),
    createdAt: u.createdAt,
  }))
}
