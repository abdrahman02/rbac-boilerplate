import type { AuditLog } from '@prisma/client'
import type { Request, Response } from 'express'
import * as auditLogService from '../services/audit-log.service.js'
import { handleError } from '../lib/handle-error.js'
import type { ApiResponse, PaginatedResponse } from '../types/index.js'

export async function list(req: Request, res: Response): Promise<void> {
	try {
		const page = Math.max(1, Number(req.query.page) || 1)
		const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))

		const rawUserId = req.query.userId
		const userId = rawUserId !== undefined ? Number(rawUserId) : undefined

		const filters = {
			userId: userId !== undefined && !Number.isNaN(userId) ? userId : undefined,
			action: typeof req.query.action === 'string' ? req.query.action : undefined,
			resourceType: typeof req.query.resourceType === 'string' ? req.query.resourceType : undefined,
			dateFrom: typeof req.query.dateFrom === 'string' ? new Date(req.query.dateFrom) : undefined,
			dateTo: typeof req.query.dateTo === 'string' ? new Date(req.query.dateTo) : undefined,
		}

		const result = await auditLogService.listAuditLogs(filters, page, limit)
		res.json(result satisfies PaginatedResponse<AuditLog>)
	} catch (err) {
		handleError(res, err)
	}
}
