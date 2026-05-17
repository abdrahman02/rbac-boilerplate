import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../config/database.js'
import type { User } from '../types/index.js'

interface UserRow extends User, RowDataPacket {}
interface CountRow extends RowDataPacket { total: number }
interface NameRow extends RowDataPacket { name: string }

export async function findAllUsers(
  page: number,
  limit: number,
): Promise<{ rows: UserRow[]; total: number }> {
  const offset = (page - 1) * limit

  const [[countRow]] = await pool.execute<CountRow[]>(
    'SELECT COUNT(*) AS total FROM users WHERE deleted_at IS NULL',
  )
  const total = countRow?.total ?? 0

  const [rows] = await pool.execute<UserRow[]>(
    `SELECT id, full_name, email, is_active, created_at, updated_at
     FROM users WHERE deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset],
  )

  return { rows, total }
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const [rows] = await pool.execute<UserRow[]>(
    `SELECT id, full_name, email, is_active, created_at, updated_at
     FROM users WHERE id = ? AND deleted_at IS NULL`,
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

export async function updateUser(
  id: number,
  fields: { full_name?: string; email?: string; is_active?: boolean },
): Promise<boolean> {
  const columnMap: { col: string; val: unknown }[] = []
  if (fields.full_name !== undefined) columnMap.push({ col: 'full_name', val: fields.full_name })
  if (fields.email !== undefined) columnMap.push({ col: 'email', val: fields.email })
  if (fields.is_active !== undefined) columnMap.push({ col: 'is_active', val: fields.is_active })

  if (columnMap.length === 0) return false

  const setClauses = columnMap.map(({ col }) => `${col} = ?`).join(', ')
  const values = columnMap.map(({ val }) => val)

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE users SET ${setClauses}, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL` as any,
    [...values, id] as any,
  )
  return result.affectedRows > 0
}

export async function softDeleteUser(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id],
  )
  return result.affectedRows > 0
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

export async function assignRoleToUser(userId: number, roleId: number): Promise<void> {
  await pool.execute(
    'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
    [userId, roleId],
  )
}

export async function removeRoleFromUser(userId: number, roleId: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
    [userId, roleId],
  )
  return result.affectedRows > 0
}

export async function emailExists(email: string, excludeId?: number): Promise<boolean> {
  interface ExistsRow extends RowDataPacket { c: number }
  const [rows] = excludeId !== undefined
    ? await pool.execute<ExistsRow[]>(
        'SELECT 1 AS c FROM users WHERE email = ? AND id != ? AND deleted_at IS NULL LIMIT 1',
        [email, excludeId],
      )
    : await pool.execute<ExistsRow[]>(
        'SELECT 1 AS c FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1',
        [email],
      )
  return rows.length > 0
}
