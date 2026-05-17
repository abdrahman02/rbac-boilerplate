import type { Request, Response, NextFunction } from 'express'
import type { ApiResponse } from '../types/index.js'

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Unauthorized',
      }
      res.status(401).json(body)
      return
    }

    if (!req.user.permissions.includes(permission)) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: `Forbidden: requires '${permission}'`,
      }
      res.status(403).json(body)
      return
    }

    next()
  }
}
