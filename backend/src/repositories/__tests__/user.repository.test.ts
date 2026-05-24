import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    user: { findMany: vi.fn() },
  },
}))

import { prisma } from '../../lib/prisma.js'
import { findAllUsersForExport } from '../user.repository.js'

const CREATED_AT = new Date('2024-01-15T10:00:00.000Z')

describe('findAllUsersForExport', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns mapped UserExportRow array with roles as string[]', async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      {
        id: 1,
        fullName: 'Alice',
        email: 'alice@example.com',
        isActive: true,
        createdAt: CREATED_AT,
        roles: [{ role: { name: 'admin' } }],
      },
    ] as never)

    const result = await findAllUsersForExport()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 1,
      fullName: 'Alice',
      email: 'alice@example.com',
      isActive: true,
      roles: ['admin'],
      createdAt: CREATED_AT,
    })
  })

  it('maps user with no roles to empty roles array', async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      {
        id: 2,
        fullName: 'Bob',
        email: 'bob@example.com',
        isActive: false,
        createdAt: CREATED_AT,
        roles: [],
      },
    ] as never)

    const result = await findAllUsersForExport()

    expect(result[0]?.roles).toEqual([])
    expect(result[0]?.isActive).toBe(false)
  })

  it('returns empty array when no users exist', async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([])

    const result = await findAllUsersForExport()

    expect(result).toEqual([])
  })
})
