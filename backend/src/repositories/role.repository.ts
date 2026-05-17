import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../config/database.js'
import type { Role } from '../types/index.js'

interface RoleRow extends Role, RowDataPacket {}
interface NameRow extends RowDataPacket { name: string }

export async function findAllRoles(): Promise<RoleRow[]> {
  const [rows] = await pool.execute<RoleRow[]>(
    'SELECT id, name, description, created_at FROM roles ORDER BY name',
  )
  return rows
}

export async function findRoleById(id: number): Promise<RoleRow | null> {
  const [rows] = await pool.execute<RoleRow[]>(
    'SELECT id, name, description, created_at FROM roles WHERE id = ?',
    [id],
  )
  return rows[0] ?? null
}

export async function findRoleByName(name: string): Promise<RoleRow | null> {
  const [rows] = await pool.execute<RoleRow[]>(
    'SELECT id, name, description, created_at FROM roles WHERE name = ?',
    [name],
  )
  return rows[0] ?? null
}

export async function createRole(name: string, description?: string): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO roles (name, description) VALUES (?, ?)',
    [name, description ?? null],
  )
  return result.insertId
}

export async function updateRole(
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
    `UPDATE roles SET ${setClauses}, updated_at = NOW() WHERE id = ?` as any,
    [...values, id] as any,
  )
  return result.affectedRows > 0
}

export async function deleteRole(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM roles WHERE id = ?',
    [id],
  )
  return result.affectedRows > 0
}

export async function getRolePermissions(roleId: number): Promise<string[]> {
  const [rows] = await pool.execute<NameRow[]>(
    `SELECT p.name FROM permissions p
     INNER JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = ?`,
    [roleId],
  )
  return rows.map((r) => r.name)
}

export async function assignPermissionToRole(
  roleId: number,
  permissionId: number,
): Promise<void> {
  await pool.execute(
    'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
    [roleId, permissionId],
  )
}

export async function removePermissionFromRole(
  roleId: number,
  permissionId: number,
): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?',
    [roleId, permissionId],
  )
  return result.affectedRows > 0
}
