import * as repo from '../repositories/role.repository.js'
import type { RoleWithPermissions } from '../types/index.js'
import type { CreateRoleInput, UpdateRoleInput } from '../schemas/role.schema.js'

export async function listRoles(): Promise<RoleWithPermissions[]> {
  const roles = await repo.findAllRoles()

  return Promise.all(
    roles.map(async (r) => {
      const permissions = await repo.getRolePermissions(r.id)
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        permissions,
        created_at: r.createdAt,
      }
    }),
  )
}

export async function getRole(roleId: number): Promise<RoleWithPermissions | null> {
  const role = await repo.findRoleById(roleId)
  if (!role) return null

  const permissions = await repo.getRolePermissions(roleId)
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions,
    created_at: role.createdAt,
  }
}

export async function createRole(input: CreateRoleInput): Promise<number> {
  const existing = await repo.findRoleByName(input.name)
  if (existing) throw new Error('ROLE_NAME_TAKEN')

  return repo.createRole(input.name, input.description)
}

export async function updateRole(roleId: number, input: UpdateRoleInput): Promise<boolean> {
  if (input.name) {
    const existing = await repo.findRoleByName(input.name)
    if (existing && existing.id !== roleId) throw new Error('ROLE_NAME_TAKEN')
  }

  const updateFields: { name?: string; description?: string | null } = {}
  if (input.name) updateFields.name = input.name
  if (input.description !== undefined) updateFields.description = input.description

  return repo.updateRole(roleId, updateFields)
}

export async function deleteRole(roleId: number): Promise<boolean> {
  return repo.deleteRole(roleId)
}

export async function assignPermission(roleId: number, permissionId: number): Promise<void> {
  const role = await repo.findRoleById(roleId)
  if (!role) throw new Error('ROLE_NOT_FOUND')

  await repo.assignPermissionToRole(roleId, permissionId)
}

export async function removePermission(roleId: number, permissionId: number): Promise<boolean> {
  return repo.removePermissionFromRole(roleId, permissionId)
}
