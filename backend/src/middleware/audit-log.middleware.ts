import type { Request, Response, NextFunction } from 'express'
import { insertAuditLog } from '../repositories/audit-log.repository.js'

export function auditLog(action: string, resourceType: string) {
	return (req: Request, res: Response, next: NextFunction): void => {
		res.on('finish', () => {
			if (res.statusCode >= 200 && res.statusCode < 300) {
				const rawId = req.params.id
				const parsedId = rawId !== undefined ? Number(rawId) : null
				const resourceId = parsedId !== null && !Number.isNaN(parsedId) ? parsedId : null

				insertAuditLog({
					userId: (res.locals.loggedInUserId as number | undefined) ?? req.user?.id ?? null,
					action,
					resourceType,
					resourceId,
					details: null,
					ipAddress: req.ip ?? null,
				}).catch(() => {
					// Intentionally swallowed — audit log must never fail the request
				})
			}
		})
		next()
	}
}
