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

export async function exportDashboard(req: Request, res: Response): Promise<void> {
  try {
    const permissions = req.user?.permissions ?? []
    const buffer = await svc.buildExportWorkbook(permissions)
    const date = new Date().toISOString().slice(0, 10)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="rbac-report-${date}.xlsx"`)
    res.send(buffer)
  } catch (err) {
    handleError(res, err)
  }
}
