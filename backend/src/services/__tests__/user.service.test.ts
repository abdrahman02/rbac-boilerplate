import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../repositories/user.repository.js', () => ({
  findUsersForExport: vi.fn(),
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

import * as repo from '../../repositories/user.repository.js'
import { buildUsersExportWorkbook } from '../user.service.js'

const MOCK_USERS = [
  { id: 1, fullName: 'Alice Doe', email: 'alice@example.com', isActive: true, roles: ['admin', 'editor'], createdAt: new Date('2024-03-01T00:00:00.000Z') },
  { id: 2, fullName: 'Bob Smith', email: 'bob@example.com', isActive: false, roles: [], createdAt: new Date('2024-04-10T00:00:00.000Z') },
]

describe('buildUsersExportWorkbook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns a Buffer', async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS)
    const result = await buildUsersExportWorkbook()
    expect(Buffer.isBuffer(result)).toBe(true)
  })

  it('calls findUsersForExport with no filters when params are undefined', async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS)
    await buildUsersExportWorkbook()
    expect(repo.findUsersForExport).toHaveBeenCalledWith({ search: undefined, role: undefined, status: undefined })
  })

  it('passes search and role filters through to the repository', async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS)
    await buildUsersExportWorkbook('alice', 'admin', undefined)
    expect(repo.findUsersForExport).toHaveBeenCalledWith({ search: 'alice', role: 'admin', status: undefined })
  })

  it('converts status "active" string to boolean true for the repository', async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS)
    await buildUsersExportWorkbook(undefined, undefined, 'active')
    expect(repo.findUsersForExport).toHaveBeenCalledWith({ search: undefined, role: undefined, status: true })
  })

  it('converts status "inactive" string to boolean false for the repository', async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS)
    await buildUsersExportWorkbook(undefined, undefined, 'inactive')
    expect(repo.findUsersForExport).toHaveBeenCalledWith({ search: undefined, role: undefined, status: false })
  })

  it('passes status undefined for unrecognised status strings', async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS)
    await buildUsersExportWorkbook(undefined, undefined, 'unknown')
    expect(repo.findUsersForExport).toHaveBeenCalledWith({ search: undefined, role: undefined, status: undefined })
  })
})
