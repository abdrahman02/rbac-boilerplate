import type { Request, Response } from 'express'
import * as svc from '../services/permission.service.js'
import type { ApiResponse, Permission } from '../types/index.js'
import type { CreatePermissionInput, UpdatePermissionInput } from '../schemas/permission.schema.js'

export async function listPermissions(req: Request, res: Response): Promise<void> {
  try {
    const permissions = await svc.listPermissions()
    const body: ApiResponse<Permission[]> = {
      success: true,
      data: permissions,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    const body: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Internal server error',
    }
    res.status(500).json(body)
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
    const body: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Internal server error',
    }
    res.status(500).json(body)
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
    const msg = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = msg === 'PERMISSION_NAME_TAKEN' ? 409 : 500

    const body: ApiResponse<null> = {
      success: false,
      data: null,
      message: msg,
    }
    res.status(statusCode).json(body)
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
    const msg = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = msg === 'PERMISSION_NAME_TAKEN' ? 409 : 500

    const body: ApiResponse<null> = {
      success: false,
      data: null,
      message: msg,
    }
    res.status(statusCode).json(body)
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
    const body: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Internal server error',
    }
    res.status(500).json(body)
  }
}
