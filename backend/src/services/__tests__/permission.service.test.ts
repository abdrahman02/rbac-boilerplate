import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../repositories/permission.repository.js', () => ({
  findAllPermissions: vi.fn(),
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

import * as repo from '../../repositories/permission.repository.js'
import { buildPermissionsExportWorkbook } from '../permission.service.js'

const MOCK_PERMISSIONS = [
  {
    id: 1,
    name: 'users:read',
    description: 'View users',
    roles: ['admin', 'viewer'],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
  },
  {
    id: 2,
    name: 'users:create',
    description: null,
    roles: [],
    createdAt: new Date('2024-02-01T00:00:00.000Z'),
  },
]

describe('buildPermissionsExportWorkbook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns a Buffer', async () => {
    vi.mocked(repo.findAllPermissions).mockResolvedValueOnce({ rows: MOCK_PERMISSIONS, total: 2 })
    const result = await buildPermissionsExportWorkbook()
    expect(Buffer.isBuffer(result)).toBe(true)
  })

  it('calls findAllPermissions with page 1, limit -1, and no filters when params are undefined', async () => {
    vi.mocked(repo.findAllPermissions).mockResolvedValueOnce({ rows: MOCK_PERMISSIONS, total: 2 })
    await buildPermissionsExportWorkbook()
    expect(repo.findAllPermissions).toHaveBeenCalledWith(1, -1, undefined, undefined)
  })

  it('passes search and usage filters through to the repository', async () => {
    vi.mocked(repo.findAllPermissions).mockResolvedValueOnce({ rows: MOCK_PERMISSIONS, total: 2 })
    await buildPermissionsExportWorkbook('users', 'used')
    expect(repo.findAllPermissions).toHaveBeenCalledWith(1, -1, 'users', 'used')
  })
})
