import * as repo from '../repositories/permission.repository.js'
import type { Permission } from '../types/index.js'
import type { CreatePermissionInput, UpdatePermissionInput } from '../schemas/permission.schema.js'

export async function listPermissions(): Promise<Permission[]> {
  return repo.findAllPermissions()
}

export async function getPermission(permissionId: number): Promise<Permission | null> {
  return repo.findPermissionById(permissionId)
}

export async function createPermission(input: CreatePermissionInput): Promise<number> {
  const existing = await repo.findPermissionByName(input.name)
  if (existing) throw new Error('PERMISSION_NAME_TAKEN')

  return repo.createPermission(input.name, input.description)
}

export async function updatePermission(
  permissionId: number,
  input: UpdatePermissionInput,
): Promise<boolean> {
  if (input.name) {
    const existing = await repo.findPermissionByName(input.name)
    if (existing && existing.id !== permissionId) throw new Error('PERMISSION_NAME_TAKEN')
  }

  const updateFields: { name?: string; description?: string | null } = {}
  if (input.name) updateFields.name = input.name
  if (input.description !== undefined) updateFields.description = input.description

  return repo.updatePermission(permissionId, updateFields)
}

export async function deletePermission(permissionId: number): Promise<boolean> {
  return repo.deletePermission(permissionId)
}
