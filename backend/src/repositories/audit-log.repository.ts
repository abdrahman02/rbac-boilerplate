import { Prisma } from "../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export interface CreateAuditLogInput {
  userId: number | null;
  action: string;
  resourceType: string;
  resourceId: number | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
}

export interface AuditLogFilters {
  userId?: number | undefined;
  search?: string | undefined;
  action?: string | undefined;
  resourceType?: string | undefined;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
}

export interface AuditLogRow {
  id: number;
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: number | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: Date;
}

export async function insertAuditLog(input: CreateAuditLogInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      details: input.details !== null ? (input.details as Prisma.InputJsonValue) : Prisma.DbNull,
      ipAddress: input.ipAddress,
    },
  });
}

export async function findAuditLogs(
  filters: AuditLogFilters,
  page: number,
  limit: number,
): Promise<{ rows: AuditLogRow[]; total: number }> {
  const where: Prisma.AuditLogWhereInput = {};

  if (filters.userId !== undefined) where.userId = filters.userId;
  if (filters.search !== undefined) {
    where.OR = [{ action: { contains: filters.search } }, { resourceType: { contains: filters.search } }];
  }
  if (filters.action !== undefined) where.action = filters.action;
  if (filters.resourceType !== undefined) where.resourceType = filters.resourceType;
  if (filters.dateFrom !== undefined || filters.dateTo !== undefined) {
    where.createdAt = {
      ...(filters.dateFrom !== undefined ? { gte: filters.dateFrom } : {}),
      ...(filters.dateTo !== undefined ? { lte: filters.dateTo } : {}),
    };
  }

  const fetchAll = limit === -1;
  const offset = fetchAll ? 0 : (page - 1) * limit;

  const [total, rawRows] = await prisma.$transaction([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: offset,
      ...(fetchAll ? {} : { take: limit }),
    }),
  ]);

  const rows: AuditLogRow[] = rawRows.map((log) => ({
    id: log.id,
    userId: log.userId,
    userName: log.user?.fullName ?? null,
    userEmail: log.user?.email ?? null,
    action: log.action,
    resourceType: log.resourceType,
    resourceId: log.resourceId,
    details: log.details as Record<string, unknown> | null,
    ipAddress: log.ipAddress,
    createdAt: log.createdAt,
  }));

  return { rows, total };
}
