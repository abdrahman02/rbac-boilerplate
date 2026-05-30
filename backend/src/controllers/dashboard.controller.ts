import type { Request, Response } from 'express'
import * as svc from '../services/dashboard.service.js'
import { handleError } from '../lib/handle-error.js'

export async function roleDistribution(_req: Request, res: Response): Promise<void> {
  try {
    const result = await svc.getRoleDistribution()
    res.status(200).json(result)
  } catch (err) {
    handleError(res, err)
  }
}

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
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10)
    const timeStr = now.toISOString().slice(11, 19).replace(/:/g, '-')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="rbac-report-${dateStr}-${timeStr}.xlsx"`)
    res.send(buffer)
  } catch (err) {
    handleError(res, err)
  }
}
