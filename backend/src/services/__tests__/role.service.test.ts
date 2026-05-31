import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../repositories/role.repository.js', () => ({
  findAllRoles: vi.fn(),
}))

vi.mock('exceljs', () => ({
  default: {
    Workbook: vi.fn(function () {
      return {
        addWorksheet: vi.fn(() => ({
          addTable: vi.fn(),
          eachRow: vi.fn(),
          getColumn: vi.fn(() => ({ width: 0 })),
          views: [],
        })),
        xlsx: { writeBuffer: vi.fn().mockResolvedValue(Buffer.from('xlsx')) },
      }
    }),
  },
}))

import * as repo from '../../repositories/role.repository.js'
import { buildRolesExportWorkbook } from '../role.service.js'

const MOCK_ROLES = [
  {
    id: 1,
    name: 'admin',
    description: 'Administrator',
    permissions: ['users:read', 'users:create'],
    users: [{ id: 1, name: 'Alice' }],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
  },
  {
    id: 2,
    name: 'viewer',
    description: null,
    permissions: ['users:read'],
    users: [],
    createdAt: new Date('2024-02-01T00:00:00.000Z'),
  },
]

describe('buildRolesExportWorkbook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns a Buffer', async () => {
    vi.mocked(repo.findAllRoles).mockResolvedValueOnce({ rows: MOCK_ROLES, total: 2 })
    const result = await buildRolesExportWorkbook()
    expect(Buffer.isBuffer(result)).toBe(true)
  })

  it('calls findAllRoles with page 1, limit -1, and no filters when params are undefined', async () => {
    vi.mocked(repo.findAllRoles).mockResolvedValueOnce({ rows: MOCK_ROLES, total: 2 })
    await buildRolesExportWorkbook()
    expect(repo.findAllRoles).toHaveBeenCalledWith(1, -1, undefined, undefined)
  })

  it('passes search and permission filters through to the repository', async () => {
    vi.mocked(repo.findAllRoles).mockResolvedValueOnce({ rows: MOCK_ROLES, total: 2 })
    await buildRolesExportWorkbook('admin', 'users:read')
    expect(repo.findAllRoles).toHaveBeenCalledWith(1, -1, 'admin', 'users:read')
  })
})
