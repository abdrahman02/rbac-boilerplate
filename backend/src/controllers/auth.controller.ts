import type { Request, Response } from 'express'
import * as authService from '../services/auth.service.js'
import {
  setAuthCookies,
  clearAuthCookies,
  hashRefreshToken,
} from '../services/token.service.js'
import { handleError } from '../lib/handle-error.js'
import type { ApiResponse, AuthenticatedUser } from '../types/index.js'

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const result = await authService.register(req.body)
    setAuthCookies(res, result.accessToken, result.refreshToken)
    res.locals.loggedInUserId = result.user.id
    const body: ApiResponse<AuthenticatedUser> = {
      success: true,
      data: result.user,
      message: null,
    }
    res.status(201).json(body)
  } catch (err) {
    handleError(res, err)
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const result = await authService.login(req.body)
    setAuthCookies(res, result.accessToken, result.refreshToken)
    res.locals.loggedInUserId = result.user.id
    const body: ApiResponse<AuthenticatedUser> = {
      success: true,
      data: result.user,
      message: null,
    }
    res.json(body)
  } catch (err) {
    handleError(res, err)
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const rawToken = req.cookies['refresh_token'] as string | undefined
    if (rawToken && req.user) {
      await authService.logout(req.user.id, hashRefreshToken(rawToken))
    }
    clearAuthCookies(res)
    const body: ApiResponse<null> = {
      success: true,
      data: null,
      message: null,
    }
    res.json(body)
  } catch (err) {
    handleError(res, err)
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const rawToken = req.cookies['refresh_token'] as string | undefined
    if (!rawToken) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'No refresh token provided',
      }
      res.status(401).json(body)
      return
    }
    const result = await authService.refresh(rawToken)
    setAuthCookies(res, result.accessToken, result.refreshToken)
    const body: ApiResponse<AuthenticatedUser> = {
      success: true,
      data: result.user,
      message: null,
    }
    res.json(body)
  } catch (err) {
    handleError(res, err)
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const user = await authService.getMe(req.user!.id)
    const body: ApiResponse<AuthenticatedUser> = {
      success: true,
      data: user,
      message: null,
    }
    res.json(body)
  } catch (err) {
    handleError(res, err)
  }
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await authService.updateMe(req.user!.id, req.body)
    const body: ApiResponse<AuthenticatedUser> = {
      success: true,
      data: user,
      message: null,
    }
    res.json(body)
  } catch (err) {
    handleError(res, err)
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    await authService.changePassword(req.user!.id, req.body)
    const body: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Password updated successfully.',
    }
    res.json(body)
  } catch (err) {
    handleError(res, err)
  }
}
