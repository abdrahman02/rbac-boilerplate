import type { Role } from '../generated/prisma/index.js'
import { Prisma } from '../generated/prisma/index.js'
import { prisma } from '../lib/prisma.js'

export interface RoleRow {
  id: number
  name: string
  description: string | null
  createdAt: Date
  permissions: string[]
}

export async function findAllRoles(
  page: number,
  limit: number,
  search?: string,
): Promise<{ rows: RoleRow[]; total: number }> {
  const fetchAll = limit === -1
  const offset = fetchAll ? 0 : (page - 1) * limit
  const where: Prisma.RoleWhereInput = search ? { name: { contains: search } } : {}

  const [total, roles] = await prisma.$transaction([
    prisma.role.count({ where }),
    prisma.role.findMany({
      where,
      include: {
        permissions: { include: { permission: { select: { name: true } } } },
      },
      orderBy: { name: 'asc' },
      skip: offset,
      ...(fetchAll ? {} : { take: limit }),
    }),
  ])

  return {
    rows: roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt,
      permissions: r.permissions.map((rp) => rp.permission.name),
    })),
    total,
  }
}

export async function findRoleById(id: number): Promise<Role | null> {
  return prisma.role.findUnique({ where: { id } })
}

export async function findRoleByName(name: string): Promise<Role | null> {
  return prisma.role.findUnique({ where: { name } })
}

export async function createRole(name: string, description?: string): Promise<number> {
  const role = await prisma.role.create({
    data: { name, description: description ?? null },
    select: { id: true },
  })
  return role.id
}

export async function updateRole(
  id: number,
  fields: { name?: string; description?: string | null },
): Promise<boolean> {
  if (Object.keys(fields).length === 0) return false

  const data: { name?: string; description?: string | null } = {}
  if (fields.name !== undefined) data.name = fields.name
  if (fields.description !== undefined) data.description = fields.description

  const result = await prisma.role.updateMany({ where: { id }, data })
  return result.count > 0
}

export async function deleteRole(id: number): Promise<boolean> {
  const result = await prisma.role.deleteMany({ where: { id } })
  return result.count > 0
}

export async function getRolePermissions(roleId: number): Promise<string[]> {
  const rows = await prisma.rolePermission.findMany({
    where: { roleId },
    select: { permission: { select: { name: true } } },
  })
  return rows.map((r) => r.permission.name)
}

export async function assignPermissionToRole(
  roleId: number,
  permissionId: number,
): Promise<void> {
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId, permissionId } },
    create: { roleId, permissionId },
    update: {},
  })
}

export async function removePermissionFromRole(
  roleId: number,
  permissionId: number,
): Promise<boolean> {
  const result = await prisma.rolePermission.deleteMany({ where: { roleId, permissionId } })
  return result.count > 0
}

export interface RoleExportRow {
  id: number
  name: string
  permissionCount: number
}

export async function findAllRolesForExport(): Promise<RoleExportRow[]> {
  const roles = await prisma.role.findMany({
    include: { _count: { select: { permissions: true } } },
    orderBy: { name: 'asc' },
  })

  return roles.map((r) => ({
    id: r.id,
    name: r.name,
    permissionCount: r._count.permissions,
  }))
}
