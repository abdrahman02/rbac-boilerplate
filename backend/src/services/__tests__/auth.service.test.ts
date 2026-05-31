import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../repositories/auth.repository.js', () => ({
  findUserByEmail: vi.fn(),
  findUserByEmailExcluding: vi.fn(),
  findUserById: vi.fn(),
  getUserRoles: vi.fn(),
  getUserPermissions: vi.fn(),
  updateUserProfile: vi.fn(),
  updateUserPassword: vi.fn(),
  createUser: vi.fn(),
  assignDefaultRole: vi.fn(),
  saveRefreshToken: vi.fn(),
  findRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn(),
}))

vi.mock('../../utils/hash.js', () => ({
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
}))

import * as repo from '../../repositories/auth.repository.js'
import { hashPassword, comparePassword } from '../../utils/hash.js'
import { updateMe, changePassword } from '../auth.service.js'
import type { User } from '../../generated/prisma/index.js'

const MOCK_USER = {
  id: 1,
  fullName: 'Alice',
  email: 'alice@example.com',
  passwordHash: 'hashed',
  isActive: true,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
} as User

describe('updateMe', () => {
  beforeEach(() => vi.resetAllMocks())

  it('updates name and returns authenticated user', async () => {
    vi.mocked(repo.findUserByEmailExcluding).mockResolvedValueOnce(null)
    vi.mocked(repo.updateUserProfile).mockResolvedValueOnce(undefined)
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_USER)
    vi.mocked(repo.getUserRoles).mockResolvedValueOnce(['admin'])
    vi.mocked(repo.getUserPermissions).mockResolvedValueOnce(['users:read'])

    const result = await updateMe(1, { name: 'New Name' })

    expect(repo.updateUserProfile).toHaveBeenCalledWith(1, { name: 'New Name', email: undefined })
    expect(result.name).toBe('Alice')
  })

  it('throws EMAIL_TAKEN when new email is already used by another user', async () => {
    vi.mocked(repo.findUserByEmailExcluding).mockResolvedValueOnce({ id: 2 } as User)

    await expect(updateMe(1, { email: 'taken@example.com' })).rejects.toThrow('EMAIL_TAKEN')
    expect(repo.updateUserProfile).not.toHaveBeenCalled()
  })

  it('skips email uniqueness check when email is not provided', async () => {
    vi.mocked(repo.updateUserProfile).mockResolvedValueOnce(undefined)
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_USER)
    vi.mocked(repo.getUserRoles).mockResolvedValueOnce([])
    vi.mocked(repo.getUserPermissions).mockResolvedValueOnce([])

    await updateMe(1, { name: 'Only Name' })

    expect(repo.findUserByEmailExcluding).not.toHaveBeenCalled()
  })
})

describe('changePassword', () => {
  beforeEach(() => vi.resetAllMocks())

  it('changes password when current password is correct', async () => {
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_USER)
    vi.mocked(comparePassword).mockResolvedValueOnce(true)
    vi.mocked(hashPassword).mockResolvedValueOnce('newhash')
    vi.mocked(repo.updateUserPassword).mockResolvedValueOnce(undefined)

    await expect(
      changePassword(1, { current_password: 'Old1234!', new_password: 'New1234!' }),
    ).resolves.not.toThrow()

    expect(repo.updateUserPassword).toHaveBeenCalledWith(1, 'newhash')
  })

  it('throws WRONG_PASSWORD when current password is incorrect', async () => {
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_USER)
    vi.mocked(comparePassword).mockResolvedValueOnce(false)

    await expect(
      changePassword(1, { current_password: 'wrong', new_password: 'New1234!' }),
    ).rejects.toThrow('WRONG_PASSWORD')

    expect(repo.updateUserPassword).not.toHaveBeenCalled()
  })

  it('throws USER_NOT_FOUND when user does not exist', async () => {
    vi.mocked(repo.findUserById).mockResolvedValueOnce(null)

    await expect(
      changePassword(999, { current_password: 'any', new_password: 'New1234!' }),
    ).rejects.toThrow('USER_NOT_FOUND')
  })
})
