import type { Permission } from '../generated/prisma/index.js'
import { Prisma } from '../generated/prisma/index.js'
import { prisma } from '../lib/prisma.js'

export async function findAllPermissions(
  page: number,
  limit: number,
  search?: string,
): Promise<{ rows: Permission[]; total: number }> {
  const fetchAll = limit === -1
  const offset = fetchAll ? 0 : (page - 1) * limit
  const where: Prisma.PermissionWhereInput = search ? { name: { contains: search } } : {}

  const [total, rows] = await prisma.$transaction([
    prisma.permission.count({ where }),
    prisma.permission.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: offset,
      ...(fetchAll ? {} : { take: limit }),
    }),
  ])

  return { rows, total }
}

export async function findPermissionById(id: number): Promise<Permission | null> {
  return prisma.permission.findUnique({ where: { id } })
}

export async function findPermissionByName(name: string): Promise<Permission | null> {
  return prisma.permission.findUnique({ where: { name } })
}

export async function createPermission(name: string, description?: string): Promise<number> {
  const p = await prisma.permission.create({
    data: { name, description: description ?? null },
    select: { id: true },
  })
  return p.id
}

export async function updatePermission(
  id: number,
  fields: { name?: string; description?: string | null },
): Promise<boolean> {
  if (Object.keys(fields).length === 0) return false

  const data: { name?: string; description?: string | null } = {}
  if (fields.name !== undefined) data.name = fields.name
  if (fields.description !== undefined) data.description = fields.description

  const result = await prisma.permission.updateMany({ where: { id }, data })
  return result.count > 0
}

export async function deletePermission(id: number): Promise<boolean> {
  const result = await prisma.permission.deleteMany({ where: { id } })
  return result.count > 0
}
