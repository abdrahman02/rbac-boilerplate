import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    role: { findMany: vi.fn() },
  },
}))

import { prisma } from '../../lib/prisma.js'
import { findAllRolesForExport } from '../role.repository.js'

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
