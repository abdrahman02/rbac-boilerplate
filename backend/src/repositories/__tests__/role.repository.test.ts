import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    $transaction: vi.fn(),
    role: { findMany: vi.fn(), count: vi.fn() },
  },
}))

import { prisma } from '../../lib/prisma.js'
import { findAllRoles, findAllRolesForExport } from '../role.repository.js'

const MOCK_ROLE_WITH_PERMISSIONS = [
  {
    id: 1,
    name: 'admin',
    description: 'Administrator',
    createdAt: new Date('2024-01-15T10:00:00.000Z'),
    permissions: [{ permission: { name: 'users:read' } }, { permission: { name: 'users:write' } }],
    users: [],
  },
]

describe('findAllRoles', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns paginated roles with mapped permissions', async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([1, MOCK_ROLE_WITH_PERMISSIONS] as never)

    const result = await findAllRoles(1, 10)

    expect(result.total).toBe(1)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0]).toEqual({
      id: 1,
      name: 'admin',
      description: 'Administrator',
      createdAt: new Date('2024-01-15T10:00:00.000Z'),
      permissions: ['users:read', 'users:write'],
      users: [],
    })
  })

  it('returns all rows when limit is -1', async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([2, MOCK_ROLE_WITH_PERMISSIONS] as never)

    const result = await findAllRoles(1, -1)

    expect(prisma.$transaction).toHaveBeenCalledOnce()
    expect(result.total).toBe(2)
  })

  it('filters by search term', async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([1, MOCK_ROLE_WITH_PERMISSIONS] as never)

    await findAllRoles(1, 10, 'admin')

    expect(prisma.$transaction).toHaveBeenCalledOnce()
  })

  it('returns empty rows when no roles match', async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([0, []] as never)

    const result = await findAllRoles(1, 10, 'nonexistent')

    expect(result.total).toBe(0)
    expect(result.rows).toEqual([])
  })
})

describe('findAllRolesForExport', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns mapped RoleExportRow array with permissionCount', async () => {
    vi.mocked(prisma.role.findMany).mockResolvedValueOnce([
      { id: 1, name: 'admin', _count: { permissions: 5 } },
    ] as never)

    const result = await findAllRolesForExport()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ id: 1, name: 'admin', permissionCount: 5 })
  })

  it('maps role with no permissions to permissionCount of 0', async () => {
    vi.mocked(prisma.role.findMany).mockResolvedValueOnce([
      { id: 2, name: 'viewer', _count: { permissions: 0 } },
    ] as never)

    const result = await findAllRolesForExport()

    expect(result[0]?.permissionCount).toBe(0)
  })

  it('returns empty array when no roles exist', async () => {
    vi.mocked(prisma.role.findMany).mockResolvedValueOnce([])

    const result = await findAllRolesForExport()

    expect(result).toEqual([])
  })
})
