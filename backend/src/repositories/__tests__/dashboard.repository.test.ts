import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    $transaction: vi.fn(),
    user: { count: vi.fn() },
    role: { count: vi.fn() },
    rolePermission: { count: vi.fn() },
    permission: { count: vi.fn() },
    auditLog: { findMany: vi.fn() },
  },
}))

import { prisma } from '../../lib/prisma.js'
import { getDashboardStats } from '../dashboard.repository.js'

const CREATED_AT = new Date('2024-01-15T10:00:00.000Z')
const SINCE_DATE = new Date('2024-01-08T00:00:00.000Z')

const MOCK_LOGS = [
  {
    id: 1,
    action: 'create_user',
    resourceType: 'user',
    resourceId: 5,
    user: { fullName: 'Admin User' },
    createdAt: CREATED_AT,
  },
]

describe('getDashboardStats', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns aggregate counts from prisma transaction', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: complex prisma transaction generics
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([42, 3, 5, 8, 24, 10, MOCK_LOGS] as any)

    const result = await getDashboardStats(SINCE_DATE)

    expect(result.totalUsers).toBe(42)
    expect(result.inactiveUsers).toBe(3)
    expect(result.newUsersThisWeek).toBe(5)
    expect(result.totalRoles).toBe(8)
    expect(result.totalPermissionsAssigned).toBe(24)
    expect(result.totalPermissions).toBe(10)
    expect(result.recentActivity).toHaveLength(1)
  })

  it('maps audit log user name correctly', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: complex prisma transaction generics
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([42, 3, 5, 8, 24, 10, MOCK_LOGS] as any)

    const result = await getDashboardStats(SINCE_DATE)

    expect(result.recentActivity[0]).toEqual({
      id: 1,
      action: 'create_user',
      resourceType: 'user',
      resourceId: 5,
      userName: 'Admin User',
      createdAt: CREATED_AT,
    })
  })

  it('maps null user to null userName', async () => {
    const logsWithNullUser = [{ ...MOCK_LOGS[0], user: null, resourceId: null }]
    // biome-ignore lint/suspicious/noExplicitAny: complex prisma transaction generics
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([0, 0, 0, 0, 0, 0, logsWithNullUser] as any)

    const result = await getDashboardStats(SINCE_DATE)
    const firstActivity = result.recentActivity[0]

    expect(firstActivity?.userName).toBeNull()
    expect(firstActivity?.resourceId).toBeNull()
  })
})
