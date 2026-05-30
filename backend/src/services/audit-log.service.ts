import * as repo from '../repositories/audit-log.repository.js'
import type { AuditLogFilters, AuditLogRow } from '../repositories/audit-log.repository.js'
import type { PaginatedResponse } from '../types/index.js'

export async function listAuditLogs(
	filters: AuditLogFilters,
	page: number,
	limit: number,
): Promise<PaginatedResponse<AuditLogRow>> {
	const { rows, total } = await repo.findAuditLogs(filters, page, limit)
	return {
		success: true,
		data: rows,
		meta: { total, page, limit },
	}
}
