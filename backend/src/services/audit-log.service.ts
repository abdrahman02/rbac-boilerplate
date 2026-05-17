import * as repo from '../repositories/audit-log.repository.js'
import type { AuditLog, PaginatedResponse } from '../types/index.js'
import type { CreateAuditLogInput, AuditLogFilters } from '../repositories/audit-log.repository.js'

export async function log(input: CreateAuditLogInput): Promise<void> {
	await repo.insertAuditLog(input)
}

export async function listAuditLogs(
	filters: AuditLogFilters,
	page: number,
	limit: number,
): Promise<PaginatedResponse<AuditLog>> {
	const { rows, total } = await repo.findAuditLogs(filters, page, limit)
	return {
		success: true,
		data: rows,
		meta: { total, page, limit },
	}
}
