import dotenv from 'dotenv'
import path from 'node:path'
import mysql from 'mysql2/promise'

dotenv.config({ path: path.resolve(import.meta.dirname, '../../.env') })

interface IdRow extends mysql.RowDataPacket {
  id: number
}

const pool = mysql.createPool({
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT'] ?? 3306),
  database: process.env['DB_NAME'],
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
})

const DEFAULT_PERMISSIONS = [
  { name: 'users:read',         description: 'View list and detail of users' },
  { name: 'users:create',       description: 'Create new users' },
  { name: 'users:update',       description: 'Update existing users' },
  { name: 'users:delete',       description: 'Delete users' },
  { name: 'roles:read',         description: 'View list and detail of roles' },
  { name: 'roles:create',       description: 'Create new roles' },
  { name: 'roles:update',       description: 'Update existing roles' },
  { name: 'roles:delete',       description: 'Delete roles' },
  { name: 'permissions:read',   description: 'View list and detail of permissions' },
  { name: 'permissions:create', description: 'Create new permissions' },
  { name: 'permissions:update', description: 'Update existing permissions' },
  { name: 'permissions:delete', description: 'Delete permissions' },
  { name: 'audit_logs:read',    description: 'View audit logs' },
]

const DEFAULT_ROLES = [
  { name: 'admin', description: 'Full system access — all permissions assigned' },
  { name: 'user',  description: 'Basic user — no admin permissions by default' },
]

async function seed(): Promise<void> {
  for (const perm of DEFAULT_PERMISSIONS) {
    await pool.execute(
      'INSERT IGNORE INTO permissions (name, description) VALUES (?, ?)',
      [perm.name, perm.description],
    )
  }
  console.log(`✓ Seeded ${DEFAULT_PERMISSIONS.length} permissions`)

  for (const role of DEFAULT_ROLES) {
    await pool.execute(
      'INSERT IGNORE INTO roles (name, description) VALUES (?, ?)',
      [role.name, role.description],
    )
  }
  console.log(`✓ Seeded ${DEFAULT_ROLES.length} roles`)

  const [adminRows] = await pool.execute<IdRow[]>(
    'SELECT id FROM roles WHERE name = ?',
    ['admin'],
  )
  const adminRole = adminRows[0]
  if (!adminRole) throw new Error('admin role not found after insert')

  const [permRows] = await pool.execute<IdRow[]>('SELECT id FROM permissions')
  for (const perm of permRows) {
    await pool.execute(
      'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
      [adminRole.id, perm.id],
    )
  }
  console.log(`✓ Assigned all ${permRows.length} permissions to admin role`)

  console.log('\nSeed complete.')
  await pool.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
