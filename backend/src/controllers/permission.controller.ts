import type { Permission } from '../generated/prisma/index.js'
import type { Request, Response } from 'express'
import * as svc from '../services/permission.service.js'
import { handleError } from '../lib/handle-error.js'
import type { ApiResponse } from '../types/index.js'
import type { CreatePermissionInput, UpdatePermissionInput } from '../schemas/permission.schema.js'

export async function listPermissions(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const rawLimit = parseInt(req.query.limit as string, 10) || 10
    const limit = rawLimit === -1 ? -1 : Math.min(100, Math.max(1, rawLimit))
    const search = typeof req.query.search === 'string' ? req.query.search.trim() || undefined : undefined
    const usage = typeof req.query.usage === 'string' ? req.query.usage.trim() || undefined : undefined

    const result = await svc.listPermissions(page, limit, search, usage)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

export async function getPermission(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid permission ID',
      }
      res.status(400).json(body)
      return
    }

    const permissionId = parseInt(id, 10)
    if (Number.isNaN(permissionId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid permission ID',
      }
      res.status(400).json(body)
      return
    }

    const permission = await svc.getPermission(permissionId)
    if (!permission) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Permission not found',
      }
      res.status(404).json(body)
      return
    }

    const body: ApiResponse<Permission> = {
      success: true,
      data: permission,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function createPermission(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body as CreatePermissionInput
    const permissionId = await svc.createPermission(input)

    const permission = await svc.getPermission(permissionId)
    const body: ApiResponse<Permission> = {
      success: true,
      data: permission,
      message: null,
    }
    res.status(201).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function updatePermission(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid permission ID',
      }
      res.status(400).json(body)
      return
    }

    const permissionId = parseInt(id, 10)
    if (Number.isNaN(permissionId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid permission ID',
      }
      res.status(400).json(body)
      return
    }

    const input = req.body as UpdatePermissionInput
    const updated = await svc.updatePermission(permissionId, input)
    if (!updated) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Permission not found',
      }
      res.status(404).json(body)
      return
    }

    const permission = await svc.getPermission(permissionId)
    const body: ApiResponse<Permission> = {
      success: true,
      data: permission,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function deletePermission(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid permission ID',
      }
      res.status(400).json(body)
      return
    }

    const permissionId = parseInt(id, 10)
    if (Number.isNaN(permissionId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid permission ID',
      }
      res.status(400).json(body)
      return
    }

    const deleted = await svc.deletePermission(permissionId)
    if (!deleted) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Permission not found',
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
