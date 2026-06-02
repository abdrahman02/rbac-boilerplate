import { config } from 'dotenv'
import { resolve } from 'node:path'
import { PrismaClient } from '../src/generated/prisma/index.js'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { env } from '../src/config/env.js'

const envPath = resolve(process.cwd(), 'backend/.env')
config({ path: envPath })

const adapter = new PrismaMariaDb({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  allowPublicKeyRetrieval: true,
})

const prisma = new PrismaClient({ adapter })

const DEFAULT_PERMISSIONS = [
  { name: 'users:read', description: 'View list and detail of users' },
  { name: 'users:create', description: 'Create new users' },
  { name: 'users:update', description: 'Update existing users' },
  { name: 'users:delete', description: 'Delete users' },
  { name: 'roles:read', description: 'View list and detail of roles' },
  { name: 'roles:create', description: 'Create new roles' },
  { name: 'roles:update', description: 'Update existing roles' },
  { name: 'roles:delete', description: 'Delete roles' },
  { name: 'permissions:read', description: 'View list and detail of permissions' },
  { name: 'permissions:create', description: 'Create new permissions' },
  { name: 'permissions:update', description: 'Update existing permissions' },
  { name: 'permissions:delete', description: 'Delete permissions' },
  { name: 'audit_logs:read', description: 'View audit logs' },
  { name: 'notifications:create', description: 'Broadcast notifications to selected roles' },
]

const DEFAULT_ROLES = [
  { name: 'admin', description: 'Full system access — all permissions assigned' },
  { name: 'user', description: 'Basic user — no admin permissions by default' },
]

async function seed(): Promise<void> {
  // Seed permissions
  for (const perm of DEFAULT_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: { name: perm.name, description: perm.description },
    })
  }
  console.log(`✓ Seeded ${DEFAULT_PERMISSIONS.length} permissions`)

  // Seed roles
  for (const role of DEFAULT_ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: { name: role.name, description: role.description },
    })
  }
  console.log(`✓ Seeded ${DEFAULT_ROLES.length} roles`)

  // Get admin role
  const adminRole = await prisma.role.findFirst({
    where: { name: 'admin' },
  })

  if (!adminRole) throw new Error('admin role not found after insert')

  // Get all permissions
  const permissions = await prisma.permission.findMany()

  // Assign all permissions to admin role
  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    })
  }
  console.log(`✓ Assigned all ${permissions.length} permissions to admin role`)

  console.log('\nSeed complete.')
  await prisma.$disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
