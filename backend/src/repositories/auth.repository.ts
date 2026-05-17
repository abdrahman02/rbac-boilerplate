import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../config/database.js'
import type { User, RefreshToken } from '../types/index.js'

interface UserRow extends User, RowDataPacket {
  password_hash: string
}

interface RefreshTokenRow extends RefreshToken, RowDataPacket {}

interface NameRow extends RowDataPacket {
  name: string
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await pool.execute<UserRow[]>(
    'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
    [email],
  )
  return rows[0] ?? null
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const [rows] = await pool.execute<UserRow[]>(
    'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
    [id],
  )
  return rows[0] ?? null
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash],
  )
  return result.insertId
}

export async function assignDefaultRole(userId: number): Promise<void> {
  await pool.execute(
    `INSERT IGNORE INTO user_roles (user_id, role_id)
     SELECT ?, id FROM roles WHERE name = 'user'`,
    [userId],
  )
}

export async function getUserRoles(userId: number): Promise<string[]> {
  const [rows] = await pool.execute<NameRow[]>(
    `SELECT r.name FROM roles r
     INNER JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
    [userId],
  )
  return rows.map((r) => r.name)
}

export async function getUserPermissions(userId: number): Promise<string[]> {
  const [rows] = await pool.execute<NameRow[]>(
    `SELECT DISTINCT p.name FROM permissions p
     INNER JOIN role_permissions rp ON rp.permission_id = p.id
     INNER JOIN user_roles ur ON ur.role_id = rp.role_id
     WHERE ur.user_id = ?`,
    [userId],
  )
  return rows.map((r) => r.name)
}

export async function saveRefreshToken(
  userId: number,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  await pool.execute(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [userId, tokenHash, expiresAt],
  )
}

export async function findRefreshToken(
  tokenHash: string,
): Promise<RefreshTokenRow | null> {
  const [rows] = await pool.execute<RefreshTokenRow[]>(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = ? AND revoked_at IS NULL`,
    [tokenHash],
  )
  return rows[0] ?? null
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  await pool.execute(
    'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?',
    [tokenHash],
  )
}

export async function revokeAllUserTokens(userId: number): Promise<void> {
  await pool.execute(
    `UPDATE refresh_tokens SET revoked_at = NOW()
     WHERE user_id = ? AND revoked_at IS NULL`,
    [userId],
  )
}
