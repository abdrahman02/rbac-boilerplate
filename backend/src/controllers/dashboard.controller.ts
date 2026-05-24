import type { Request, Response } from 'express'
import * as svc from '../services/dashboard.service.js'
import { handleError } from '../lib/handle-error.js'

export async function stats(_req: Request, res: Response): Promise<void> {
  try {
    const result = await svc.getDashboardStats()
    res.status(200).json(result)
  } catch (err) {
    handleError(res, err)
  }
}
