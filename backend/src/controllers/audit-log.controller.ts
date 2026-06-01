import { PAGINATION } from "../constants/pagination.js";
import { asyncHandler } from "../lib/async-handler.js";
import * as auditLogService from "../services/audit-log.service.js";

const DEFAULT_AUDIT_LIMIT = 20;

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const rawLimit = Number(req.query.limit) || DEFAULT_AUDIT_LIMIT;
  const limit =
    rawLimit === PAGINATION.UNPAGINATED
      ? PAGINATION.UNPAGINATED
      : Math.min(PAGINATION.MAX_LIMIT, Math.max(PAGINATION.MIN_LIMIT, rawLimit));

  const rawUserId = req.query.userId;
  const userId = rawUserId !== undefined ? Number(rawUserId) : undefined;

  const filters = {
    userId: userId !== undefined && !Number.isNaN(userId) ? userId : undefined,
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    action: typeof req.query.action === "string" ? req.query.action : undefined,
    resourceType: typeof req.query.resourceType === "string" ? req.query.resourceType : undefined,
    dateFrom: typeof req.query.dateFrom === "string" ? new Date(req.query.dateFrom) : undefined,
    dateTo: typeof req.query.dateTo === "string" ? new Date(req.query.dateTo) : undefined,
  };

  const result = await auditLogService.listAuditLogs(filters, page, limit);
  res.json(result);
});
