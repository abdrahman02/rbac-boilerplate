import type { Request, Response } from 'express'
import * as auditLogService from '../services/audit-log.service.js'
import type { ApiResponse, AuditLog, PaginatedResponse } from '../types/index.js'

export async function list(req: Request, res: Response): Promise<void> {
	try {
		const page = Math.max(1, Number(req.query.page) || 1)
		const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))

		const rawUserId = req.query.user_id
		const userId = rawUserId !== undefined ? Number(rawUserId) : undefined

		const filters = {
			user_id: userId !== undefined && !Number.isNaN(userId) ? userId : undefined,
			action: typeof req.query.action === 'string' ? req.query.action : undefined,
			resource_type: typeof req.query.resource_type === 'string' ? req.query.resource_type : undefined,
			date_from: typeof req.query.date_from === 'string' ? new Date(req.query.date_from) : undefined,
			date_to: typeof req.query.date_to === 'string' ? new Date(req.query.date_to) : undefined,
		}

		const result = await auditLogService.listAuditLogs(filters, page, limit)
		res.json(result satisfies PaginatedResponse<AuditLog>)
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Internal server error'
		const body: ApiResponse<null> = { success: false, data: null, message }
		res.status(500).json(body)
	}
}
