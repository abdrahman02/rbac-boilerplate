import { prisma } from '../lib/prisma.js'
import type { Role } from '../types/index.js'

function mapRole(r: {
  id: number
  name: string
  description: string | null
  createdAt: Date
}): Role {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    created_at: r.createdAt,
  }
}

export async function findAllRoles(): Promise<Role[]> {
  const rows = await prisma.role.findMany({
    select: { id: true, name: true, description: true, createdAt: true },
    orderBy: { name: 'asc' },
  })
  return rows.map(mapRole)
}

export async function findRoleById(id: number): Promise<Role | null> {
  const role = await prisma.role.findUnique({
    where: { id },
    select: { id: true, name: true, description: true, createdAt: true },
  })
  return role ? mapRole(role) : null
}

export async function findRoleByName(name: string): Promise<Role | null> {
  const role = await prisma.role.findUnique({
    where: { name },
    select: { id: true, name: true, description: true, createdAt: true },
  })
  return role ? mapRole(role) : null
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
