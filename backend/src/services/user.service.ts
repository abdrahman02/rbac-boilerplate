import { Prisma } from '../generated/prisma/index.js'
import * as repo from '../repositories/user.repository.js'
import { hashPassword } from '../utils/hash.js'
import type { UserWithRoles, PaginatedResponse } from '../types/index.js'
import type { CreateUserInput, UpdateUserInput } from '../schemas/user.schema.js'
import ExcelJS from 'exceljs'
import { freezeHeaderRow, autoFitColumns } from '../lib/excel-styles.js'
import type { UserFilteredExportParams } from '../repositories/user.repository.js'

export async function listUsers(
  page: number,
  limit: number,
  search?: string,
  role?: string,
  status?: boolean,
): Promise<PaginatedResponse<UserWithRoles>> {
  const { rows, total } = await repo.findAllUsers(page, limit, search, role, status)

  const data = await Promise.all(
    rows.map(async (u) => {
      const roles = await repo.getUserRoles(u.id)
      return {
        id: u.id,
        name: u.fullName,
        email: u.email,
        is_active: u.isActive,
        roles,
        created_at: u.createdAt,
      }
    }),
  )

  return {
    success: true,
    data,
    meta: {
      total,
      page,
      limit,
    },
  }
}

export async function getUser(userId: number): Promise<UserWithRoles | null> {
  const user = await repo.findUserById(userId)
  if (!user) return null

  const roles = await repo.getUserRoles(userId)
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    is_active: user.isActive,
    roles,
    created_at: user.createdAt,
  }
}

export async function createUser(input: CreateUserInput): Promise<number> {
  const emailTaken = await repo.emailExists(input.email)
  if (emailTaken) throw new Error('EMAIL_TAKEN')

  // Free the email constraint from any soft-deleted rows (legacy data before anonymization fix)
  await repo.anonymizeDeletedEmail(input.email)

  const passwordHash = await hashPassword(input.password)

  let userId: number
  try {
    userId = await repo.createUser(input.name, input.email, passwordHash)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new Error('EMAIL_TAKEN')
    }
    throw err
  }

  if (input.role_ids && input.role_ids.length > 0) {
    for (const roleId of input.role_ids) {
      await repo.assignRoleToUser(userId, roleId)
    }
  }

  return userId
}

export async function updateUser(userId: number, input: UpdateUserInput): Promise<boolean> {
  if (input.email) {
    const emailTaken = await repo.emailExists(input.email, userId)
    if (emailTaken) throw new Error('EMAIL_TAKEN')
  }

  const updateFields: { fullName?: string; email?: string; isActive?: boolean } = {}
  if (input.name) updateFields.fullName = input.name
  if (input.email) updateFields.email = input.email
  if (input.is_active !== undefined) updateFields.isActive = input.is_active

  return repo.updateUser(userId, updateFields)
}

export async function deleteUser(userId: number): Promise<boolean> {
  return repo.softDeleteUser(userId)
}

export async function removeRole(userId: number, roleId: number): Promise<boolean> {
  return repo.removeRoleFromUser(userId, roleId)
}

export async function syncRoles(userId: number, roleIds: number[]): Promise<void> {
  const user = await repo.findUserById(userId)
  if (!user) throw new Error('USER_NOT_FOUND')
  await repo.syncUserRoles(userId, roleIds)
}

export async function buildUsersExportWorkbook(
  search?: string,
  role?: string,
  status?: string,
): Promise<Buffer> {
  const statusBool: boolean | undefined =
    status === 'active' ? true : status === 'inactive' ? false : undefined

  const filters: UserFilteredExportParams = {
    ...(search !== undefined && { search }),
    ...(role !== undefined && { role }),
    ...(statusBool !== undefined && { status: statusBool }),
  }
  const users = await repo.findUsersForExport(filters)

  const wb = new ExcelJS.Workbook()
  const sheet = wb.addWorksheet('Users')
  freezeHeaderRow(sheet)
  sheet.addTable({
    name: 'Users',
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: { theme: 'TableStyleMedium2', showRowStripes: false },
    columns: [
      { name: 'Name' },
      { name: 'Email' },
      { name: 'Status' },
      { name: 'Roles' },
      { name: 'Created At' },
    ],
    rows: users.map((u) => [
      u.fullName,
      u.email,
      u.isActive ? 'Active' : 'Inactive',
      u.roles.join(', '),
      u.createdAt.toISOString().slice(0, 10),
    ]),
  })
  autoFitColumns(sheet)

  return Buffer.from(await wb.xlsx.writeBuffer())
}
