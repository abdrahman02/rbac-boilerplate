import { prisma } from '../lib/prisma.js'
import type { Permission } from '../types/index.js'

function mapPermission(p: {
  id: number
  name: string
  description: string | null
  createdAt: Date
}): Permission {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    created_at: p.createdAt,
  }
}

export async function findAllPermissions(): Promise<Permission[]> {
  const rows = await prisma.permission.findMany({
    select: { id: true, name: true, description: true, createdAt: true },
    orderBy: { name: 'asc' },
  })
  return rows.map(mapPermission)
}

export async function findPermissionById(id: number): Promise<Permission | null> {
  const p = await prisma.permission.findUnique({
    where: { id },
    select: { id: true, name: true, description: true, createdAt: true },
  })
  return p ? mapPermission(p) : null
}

export async function findPermissionByName(name: string): Promise<Permission | null> {
  const p = await prisma.permission.findUnique({
    where: { name },
    select: { id: true, name: true, description: true, createdAt: true },
  })
  return p ? mapPermission(p) : null
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
