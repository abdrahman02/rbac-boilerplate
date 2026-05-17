import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../config/database.js'
import type { AuditLog } from '../types/index.js'

interface AuditLogRow extends AuditLog, RowDataPacket {}
interface CountRow extends RowDataPacket {
	total: number
}

export interface CreateAuditLogInput {
	userId: number | null
	action: string
	resourceType: string
	resourceId: number | null
	details: Record<string, unknown> | null
	ipAddress: string | null
}

export interface AuditLogFilters {
	user_id?: number
	action?: string
	resource_type?: string
	date_from?: Date
	date_to?: Date
}

export async function insertAuditLog(input: CreateAuditLogInput): Promise<void> {
	await pool.execute<ResultSetHeader>(
		`INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		[
			input.userId,
			input.action,
			input.resourceType,
			input.resourceId,
			input.details !== null ? JSON.stringify(input.details) : null,
			input.ipAddress,
		],
	)
}

export async function findAuditLogs(
	filters: AuditLogFilters,
	page: number,
	limit: number,
): Promise<{ rows: AuditLogRow[]; total: number }> {
	const conditions: string[] = []
	const params: unknown[] = []

	if (filters.user_id !== undefined) {
		conditions.push('user_id = ?')
		params.push(filters.user_id)
	}
	if (filters.action !== undefined) {
		conditions.push('action LIKE ?')
		params.push('%' + filters.action + '%')
	}
	if (filters.resource_type !== undefined) {
		conditions.push('resource_type = ?')
		params.push(filters.resource_type)
	}
	if (filters.date_from !== undefined) {
		conditions.push('created_at >= ?')
		params.push(filters.date_from)
	}
	if (filters.date_to !== undefined) {
		conditions.push('created_at <= ?')
		params.push(filters.date_to)
	}

	const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''

	const [[countRow]] = await pool.execute<CountRow[]>(
		'SELECT COUNT(*) AS total FROM audit_logs ' + whereClause,
		params,
	)
	const total = countRow?.total ?? 0

	const offset = (page - 1) * limit
	const [rows] = await pool.execute<AuditLogRow[]>(
		'SELECT id, user_id, action, resource_type, resource_id, details, ip_address, created_at' +
			' FROM audit_logs ' +
			whereClause +
			' ORDER BY created_at DESC LIMIT ? OFFSET ?',
		[...params, limit, offset],
	)

	return { rows, total }
}
