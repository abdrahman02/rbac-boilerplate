import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../repositories/dashboard.repository.js', () => ({
  getDashboardStats: vi.fn(),
}))

import * as repo from '../../repositories/dashboard.repository.js'
import { getDashboardStats } from '../dashboard.service.js'

const MOCK_RAW = {
  totalUsers: 42,
  inactiveUsers: 3,
  newUsersThisWeek: 5,
  totalRoles: 8,
  totalPermissionsAssigned: 24,
  totalPermissions: 10,
  recentActivity: [
    {
      id: 1,
      action: 'create_user',
      resourceType: 'user',
      resourceId: 5,
      userName: 'Admin User',
      createdAt: new Date('2024-01-15T10:00:00.000Z'),
    },
  ],
}

describe('dashboard service — getDashboardStats', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns success response with all fields', async () => {
    vi.mocked(repo.getDashboardStats).mockResolvedValueOnce(MOCK_RAW)

    const result = await getDashboardStats()

    expect(result.success).toBe(true)
    expect(result.data?.totalUsers).toBe(42)
    expect(result.data?.newUsersThisWeek).toBe(5)
    expect(result.data?.inactiveUsers).toBe(3)
    expect(result.data?.totalRoles).toBe(8)
    expect(result.data?.totalPermissionsAssigned).toBe(24)
    expect(result.data?.totalPermissions).toBe(10)
    expect(result.message).toBeNull()
  })

  it('converts createdAt Date to ISO 8601 string', async () => {
    vi.mocked(repo.getDashboardStats).mockResolvedValueOnce(MOCK_RAW)

    const result = await getDashboardStats()

    expect(result.data?.recentActivity[0]?.createdAt).toBe('2024-01-15T10:00:00.000Z')
    expect(typeof result.data?.recentActivity[0]?.createdAt).toBe('string')
  })

  it('preserves null userName in recentActivity', async () => {
    const rawWithNullUser = {
      ...MOCK_RAW,
      recentActivity: [{ ...MOCK_RAW.recentActivity[0], userName: null }],
    }
    vi.mocked(repo.getDashboardStats).mockResolvedValueOnce(rawWithNullUser)

    const result = await getDashboardStats()

    expect(result.data?.recentActivity[0]?.userName).toBeNull()
  })

  it('returns empty recentActivity array when no logs', async () => {
    vi.mocked(repo.getDashboardStats).mockResolvedValueOnce({ ...MOCK_RAW, recentActivity: [] })

    const result = await getDashboardStats()

    expect(result.data?.recentActivity).toEqual([])
  })
})
