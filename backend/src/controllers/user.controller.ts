import type { Request, Response } from 'express'
import * as svc from '../services/user.service.js'
import { handleError } from '../lib/handle-error.js'
import type { ApiResponse, UserWithRoles, PaginatedResponse } from '../types/index.js'
import type { CreateUserInput, UpdateUserInput, SyncRolesInput } from '../schemas/user.schema.js'

export async function listUsers(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10))
    const search = typeof req.query.search === 'string' ? req.query.search.trim() || undefined : undefined
    const role = typeof req.query.role === 'string' ? req.query.role.trim() || undefined : undefined
    const statusStr = typeof req.query.status === 'string' ? req.query.status : undefined
    const status = statusStr === 'active' ? true : statusStr === 'inactive' ? false : undefined

    const result = await svc.listUsers(page, limit, search, role, status)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid user ID',
      }
      res.status(400).json(body)
      return
    }

    const userId = parseInt(id, 10)
    if (Number.isNaN(userId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid user ID',
      }
      res.status(400).json(body)
      return
    }

    const user = await svc.getUser(userId)
    if (!user) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'User not found',
      }
      res.status(404).json(body)
      return
    }

    const body: ApiResponse<UserWithRoles> = {
      success: true,
      data: user,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body as CreateUserInput
    const userId = await svc.createUser(input)

    const user = await svc.getUser(userId)
    const body: ApiResponse<UserWithRoles> = {
      success: true,
      data: user,
      message: null,
    }
    res.status(201).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid user ID',
      }
      res.status(400).json(body)
      return
    }

    const userId = parseInt(id, 10)
    if (Number.isNaN(userId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid user ID',
      }
      res.status(400).json(body)
      return
    }

    const input = req.body as UpdateUserInput
    const updated = await svc.updateUser(userId, input)
    if (!updated) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'User not found',
      }
      res.status(404).json(body)
      return
    }

    const user = await svc.getUser(userId)
    const body: ApiResponse<UserWithRoles> = {
      success: true,
      data: user,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid user ID',
      }
      res.status(400).json(body)
      return
    }

    const userId = parseInt(id, 10)
    if (Number.isNaN(userId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid user ID',
      }
      res.status(400).json(body)
      return
    }

    const deleted = await svc.deleteUser(userId)
    if (!deleted) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'User not found',
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

export async function syncRoles(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    if (!id) {
      const body: ApiResponse<null> = { success: false, data: null, message: 'Invalid user ID' }
      res.status(400).json(body)
      return
    }

    const userId = parseInt(id, 10)
    if (Number.isNaN(userId)) {
      const body: ApiResponse<null> = { success: false, data: null, message: 'Invalid user ID' }
      res.status(400).json(body)
      return
    }

    const input = req.body as SyncRolesInput
    await svc.syncRoles(userId, input.role_ids)

    const user = await svc.getUser(userId)
    const body: ApiResponse<UserWithRoles> = { success: true, data: user, message: null }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}

export async function removeRole(req: Request, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined
    const roleIdStr = typeof req.params.roleId === 'string' ? req.params.roleId : undefined

    if (!id || !roleIdStr) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid user ID or role ID',
      }
      res.status(400).json(body)
      return
    }

    const userId = parseInt(id, 10)
    const roleId = parseInt(roleIdStr, 10)

    if (Number.isNaN(userId) || Number.isNaN(roleId)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Invalid user ID or role ID',
      }
      res.status(400).json(body)
      return
    }

    const removed = await svc.removeRole(userId, roleId)
    if (!removed) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'User or role not found',
      }
      res.status(404).json(body)
      return
    }

    const user = await svc.getUser(userId)
    const body: ApiResponse<UserWithRoles> = {
      success: true,
      data: user,
      message: null,
    }
    res.status(200).json(body)
  } catch (error) {
    handleError(res, error)
  }
}
