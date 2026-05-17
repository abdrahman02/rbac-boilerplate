import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import type { AuditLog } from '../types/index.js'

export interface CreateAuditLogInput {
  userId: number | null
  action: string
  resourceType: string
  resourceId: number | null
  details: Record<string, unknown> | null
  ipAddress: string | null
}

export interface AuditLogFilters {
  user_id?: number | undefined
  action?: string | undefined
  resource_type?: string | undefined
  date_from?: Date | undefined
  date_to?: Date | undefined
}

function mapAuditLog(log: {
  id: number
  userId: number | null
  action: string
  resourceType: string
  resourceId: number | null
  details: Prisma.JsonValue | null
  ipAddress: string | null
  createdAt: Date
}): AuditLog {
  return {
    id: log.id,
    user_id: log.userId,
    action: log.action,
    resource_type: log.resourceType,
    resource_id: log.resourceId,
    details: log.details !== null ? (log.details as Record<string, unknown>) : null,
    ip_address: log.ipAddress,
    created_at: log.createdAt,
  }
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
  })
}

export async function findAuditLogs(
  filters: AuditLogFilters,
  page: number,
  limit: number,
): Promise<{ rows: AuditLog[]; total: number }> {
  const where: Prisma.AuditLogWhereInput = {}

  if (filters.user_id !== undefined) where.userId = filters.user_id
  if (filters.action !== undefined) where.action = { contains: filters.action }
  if (filters.resource_type !== undefined) where.resourceType = filters.resource_type
  if (filters.date_from !== undefined || filters.date_to !== undefined) {
    where.createdAt = {
      ...(filters.date_from !== undefined ? { gte: filters.date_from } : {}),
      ...(filters.date_to !== undefined ? { lte: filters.date_to } : {}),
    }
  }

  const offset = (page - 1) * limit

  const [total, logs] = await prisma.$transaction([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      select: {
        id: true,
        userId: true,
        action: true,
        resourceType: true,
        resourceId: true,
        details: true,
        ipAddress: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
  ])

  return { rows: logs.map(mapAuditLog), total }
}
