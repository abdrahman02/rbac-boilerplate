import type { Request, Response } from 'express'
import * as svc from '../services/role.service.js'
import { handleError } from '../lib/handle-error.js'
import type { ApiResponse, RoleWithPermissions, PaginatedResponse } from '../types/index.js'
import type { CreateRoleInput, UpdateRoleInput, AssignPermissionInput, SyncPermissionsInput } from '../schemas/role.schema.js'

export async function listRoles(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const rawLimit = parseInt(req.query.limit as string, 10) || 10
    const limit = rawLimit === -1 ? -1 : Math.min(100, Math.max(1, rawLimit))
    const search = typeof req.query.search === 'string' ? req.query.search.trim() || undefined : undefined
    const permission = typeof req.query.permission === 'string' ? req.query.permission.trim() || undefined : undefined

    const result: PaginatedResponse<RoleWithPermissions> = await svc.listRoles(page, limit, search, permission)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

export async function getRole(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID',
      }
      res.status(400).json(body)
      return
    }

    const roleId = parseInt(id, 10)
    if (Number.isNaN(roleId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID',
      }
      res.status(400).json(body)
      return
    }

    const role = await svc.getRole(roleId)
    if (!role) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Role not found',
      }
      res.status(404).json(body)
      return
    }

    const body: ApiResponse<RoleWithPermissions> = {
      success: true,
      data: role,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function createRole(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body as CreateRoleInput
    const roleId = await svc.createRole(input)

    const role = await svc.getRole(roleId)
    const body: ApiResponse<RoleWithPermissions> = {
      success: true,
      data: role,
      message: null,
    }
    res.status(201).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function updateRole(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID',
      }
      res.status(400).json(body)
      return
    }

    const roleId = parseInt(id, 10)
    if (Number.isNaN(roleId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID',
      }
      res.status(400).json(body)
      return
    }

    const input = req.body as UpdateRoleInput
    const updated = await svc.updateRole(roleId, input)
    if (!updated) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Role not found',
      }
      res.status(404).json(body)
      return
    }

    const role = await svc.getRole(roleId)
    const body: ApiResponse<RoleWithPermissions> = {
      success: true,
      data: role,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function deleteRole(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID',
      }
      res.status(400).json(body)
      return
    }

    const roleId = parseInt(id, 10)
    if (Number.isNaN(roleId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID',
      }
      res.status(400).json(body)
      return
    }

    const deleted = await svc.deleteRole(roleId)
    if (!deleted) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Role not found',
      }
      res.status(404).json(body)
      return
    }

    const body: ApiResponse<null> = {
      success: true,
      data: null,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function assignPermission(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID',
      }
      res.status(400).json(body)
      return
    }

    const roleId = parseInt(id, 10)
    if (Number.isNaN(roleId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID',
      }
      res.status(400).json(body)
      return
    }

    const input = req.body as AssignPermissionInput
    await svc.assignPermission(roleId, input.permission_id)

    const role = await svc.getRole(roleId)
    const body: ApiResponse<RoleWithPermissions> = {
      success: true,
      data: role,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function syncPermissions(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = { success: false, data: null, message: 'Invalid role ID' }
      res.status(400).json(body)
      return
    }

    const roleId = parseInt(id, 10)
    if (Number.isNaN(roleId)) {
      const body: ApiResponse<null> = { success: false, data: null, message: 'Invalid role ID' }
      res.status(400).json(body)
      return
    }

    const input = req.body as SyncPermissionsInput
    await svc.syncPermissions(roleId, input.permission_ids)

    const role = await svc.getRole(roleId)
    const body: ApiResponse<RoleWithPermissions> = { success: true, data: role, message: null }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function removePermission(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    const permissionIdStr = typeof req.params.permissionId === 'string' ? req.params.permissionId : undefined

    if (!id || !permissionIdStr) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID or permission ID',
      }
      res.status(400).json(body)
      return
    }

    const roleId = parseInt(id, 10)
    const permissionId = parseInt(permissionIdStr, 10)

    if (Number.isNaN(roleId) || Number.isNaN(permissionId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid role ID or permission ID',
      }
      res.status(400).json(body)
      return
    }

    const removed = await svc.removePermission(roleId, permissionId)
    if (!removed) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Role or permission not found',
      }
      res.status(404).json(body)
      return
    }

    const role = await svc.getRole(roleId)
    const body: ApiResponse<RoleWithPermissions> = {
      success: true,
      data: role,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function exportRoles(req: Request, res: Response): Promise<void> {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() || undefined : undefined
    const permission = typeof req.query.permission === 'string' ? req.query.permission.trim() || undefined : undefined

    const buffer = await svc.buildRolesExportWorkbook(search, permission)
    const dateStr = new Date().toISOString().slice(0, 10)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="roles-${dateStr}.xlsx"`)
    res.send(buffer)
  } catch (error) {
    handleError(res, error)
  }
}
