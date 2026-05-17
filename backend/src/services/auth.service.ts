import * as repo from '../repositories/auth.repository.js'
import * as tokenSvc from './token.service.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import type { AuthenticatedUser } from '../types/index.js'
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js'

export interface AuthResult {
  user: AuthenticatedUser
  accessToken: string
  refreshToken: string
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await repo.findUserByEmail(input.email)
  if (existing) throw new Error('EMAIL_TAKEN')

  const passwordHash = await hashPassword(input.password)
  const userId = await repo.createUser(input.name, input.email, passwordHash)
  await repo.assignDefaultRole(userId)

  return buildAuthResult(userId)
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await repo.findUserByEmail(input.email)
  if (!user) throw new Error('INVALID_CREDENTIALS')

  const valid = await comparePassword(input.password, user.password_hash)
  if (!valid) throw new Error('INVALID_CREDENTIALS')

  if (!user.is_active) throw new Error('ACCOUNT_DISABLED')

  return buildAuthResult(user.id)
}

export async function logout(
  userId: number,
  refreshTokenHash: string,
): Promise<void> {
  await repo.revokeRefreshToken(refreshTokenHash)
}

export async function refresh(rawRefreshToken: string): Promise<AuthResult> {
  const tokenHash = tokenSvc.hashRefreshToken(rawRefreshToken)
  const stored = await repo.findRefreshToken(tokenHash)

  if (!stored) throw new Error('INVALID_REFRESH_TOKEN')

  const now = new Date()
  if (now > new Date(stored.expires_at)) {
    await repo.revokeRefreshToken(tokenHash)
    throw new Error('REFRESH_TOKEN_EXPIRED')
  }

  await repo.revokeRefreshToken(tokenHash)
  return buildAuthResult(stored.user_id)
}

export async function getMe(userId: number): Promise<AuthenticatedUser> {
  const user = await repo.findUserById(userId)
  if (!user) throw new Error('USER_NOT_FOUND')

  const [roles, permissions] = await Promise.all([
    repo.getUserRoles(userId),
    repo.getUserPermissions(userId),
  ])

  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    roles,
    permissions,
  }
}

async function buildAuthResult(userId: number): Promise<AuthResult> {
  const user = await repo.findUserById(userId)
  if (!user) throw new Error('USER_NOT_FOUND')

  const [roles, permissions] = await Promise.all([
    repo.getUserRoles(userId),
    repo.getUserPermissions(userId),
  ])

  const authenticatedUser: AuthenticatedUser = {
    id: user.id,
    name: user.full_name,
    email: user.email,
    roles,
    permissions,
  }

  const accessToken = tokenSvc.signAccessToken({
    userId: user.id,
    email: user.email,
    roles,
    permissions,
  })

  const rawRefresh = tokenSvc.generateRefreshToken()
  const refreshHash = tokenSvc.hashRefreshToken(rawRefresh)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await repo.saveRefreshToken(userId, refreshHash, expiresAt)

  return { user: authenticatedUser, accessToken, refreshToken: rawRefresh }
}
