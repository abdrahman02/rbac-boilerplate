import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../config/database.js'
import type { Permission } from '../types/index.js'

interface PermissionRow extends Permission, RowDataPacket {}

export async function findAllPermissions(): Promise<PermissionRow[]> {
  const [rows] = await pool.execute<PermissionRow[]>(
    'SELECT id, name, description, created_at FROM permissions ORDER BY name',
  )
  return rows
}

export async function findPermissionById(id: number): Promise<PermissionRow | null> {
  const [rows] = await pool.execute<PermissionRow[]>(
    'SELECT id, name, description, created_at FROM permissions WHERE id = ?',
    [id],
  )
  return rows[0] ?? null
}

export async function findPermissionByName(name: string): Promise<PermissionRow | null> {
  const [rows] = await pool.execute<PermissionRow[]>(
    'SELECT id, name FROM permissions WHERE name = ?',
    [name],
  )
  return rows[0] ?? null
}

export async function createPermission(name: string, description?: string): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO permissions (name, description) VALUES (?, ?)',
    [name, description ?? null],
  )
  return result.insertId
}

export async function updatePermission(
  id: number,
  fields: { name?: string; description?: string | null },
): Promise<boolean> {
  const columnMap: { col: string; val: unknown }[] = []
  if (fields.name !== undefined) columnMap.push({ col: 'name', val: fields.name })
  if (fields.description !== undefined) columnMap.push({ col: 'description', val: fields.description })

  if (columnMap.length === 0) return false

  const setClauses = columnMap.map(({ col }) => `${col} = ?`).join(', ')
  const values = columnMap.map(({ val }) => val)

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE permissions SET ${setClauses}, updated_at = NOW() WHERE id = ?` as any,
    [...values, id] as any,
  )
  return result.affectedRows > 0
}

export async function deletePermission(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM permissions WHERE id = ?',
    [id],
  )
  return result.affectedRows > 0
}
