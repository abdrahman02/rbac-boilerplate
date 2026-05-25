import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../repositories/dashboard.repository.js', () => ({
  getDashboardStats: vi.fn(),
}))

vi.mock('../../repositories/user.repository.js', () => ({
  findAllUsersForExport: vi.fn(),
}))

vi.mock('../../repositories/role.repository.js', () => ({
  findAllRolesForExport: vi.fn(),
}))

vi.mock('exceljs', () => ({
  default: {
    // Regular function required — arrow functions cannot be used as constructors
    Workbook: vi.fn(function () {
      return {
        addWorksheet: vi.fn(() => ({
          addRow: vi.fn(() => ({ height: 0, eachCell: vi.fn() })),
          eachRow: vi.fn(),
          getColumn: vi.fn(() => ({ width: 0 })),
          views: [],
        })),
        xlsx: { writeBuffer: vi.fn().mockResolvedValue(Buffer.from('xlsx')) },
      }
    }),
  },
}))

import * as repo from '../../repositories/dashboard.repository.js'
import type { RecentActivityItem } from '../../repositories/dashboard.repository.js'
import * as userRepo from '../../repositories/user.repository.js'
import * as roleRepo from '../../repositories/role.repository.js'
import { getDashboardStats, buildExportWorkbook } from '../dashboard.service.js'

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

const MOCK_USERS = [
  {
    id: 1,
    fullName: 'Alice',
    email: 'alice@example.com',
    isActive: true,
    roles: ['admin'],
    createdAt: new Date('2024-01-15T10:00:00.000Z'),
  },
]

const MOCK_ROLES = [{ id: 1, name: 'admin', permissionCount: 5 }]

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
      recentActivity: [{ ...MOCK_RAW.recentActivity[0], userName: null }] as RecentActivityItem[],
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

describe('dashboard service — buildExportWorkbook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('always fetches stats and returns a Buffer', async () => {
    vi.mocked(repo.getDashboardStats).mockResolvedValueOnce(MOCK_RAW)

    const result = await buildExportWorkbook([])

    expect(repo.getDashboardStats).toHaveBeenCalledOnce()
    expect(Buffer.isBuffer(result)).toBe(true)
  })

  it('fetches users when users:read permission is present', async () => {
    vi.mocked(repo.getDashboardStats).mockResolvedValueOnce(MOCK_RAW)
    vi.mocked(userRepo.findAllUsersForExport).mockResolvedValueOnce(MOCK_USERS)

    await buildExportWorkbook(['users:read'])

    expect(userRepo.findAllUsersForExport).toHaveBeenCalledOnce()
  })

  it('does not fetch users when users:read permission is absent', async () => {
    vi.mocked(repo.getDashboardStats).mockResolvedValueOnce(MOCK_RAW)

    await buildExportWorkbook([])

    expect(userRepo.findAllUsersForExport).not.toHaveBeenCalled()
  })

  it('fetches roles when roles:read permission is present', async () => {
    vi.mocked(repo.getDashboardStats).mockResolvedValueOnce(MOCK_RAW)
    vi.mocked(roleRepo.findAllRolesForExport).mockResolvedValueOnce(MOCK_ROLES)

    await buildExportWorkbook(['roles:read'])

    expect(roleRepo.findAllRolesForExport).toHaveBeenCalledOnce()
  })
})
