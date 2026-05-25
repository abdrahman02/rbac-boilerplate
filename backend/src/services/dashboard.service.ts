import ExcelJS from 'exceljs'
import * as repo from '../repositories/dashboard.repository.js'
import * as userRepo from '../repositories/user.repository.js'
import * as roleRepo from '../repositories/role.repository.js'
import { freezeHeaderRow, autoFitColumns } from '../lib/excel-styles.js'
import type { DashboardStatsRaw } from '../repositories/dashboard.repository.js'
import type { UserExportRow } from '../repositories/user.repository.js'
import type { RoleExportRow } from '../repositories/role.repository.js'
import type { ApiResponse } from '../types/index.js'

interface RecentActivityDto {
  id: number
  action: string
  resourceType: string
  resourceId: number | null
  userName: string | null
  createdAt: string
}

export interface DashboardStatsDto {
  totalUsers: number
  newUsersThisWeek: number
  inactiveUsers: number
  totalRoles: number
  totalPermissionsAssigned: number
  totalPermissions: number
  recentActivity: RecentActivityDto[]
}

const TABLE_STYLE = { theme: 'TableStyleMedium2', showRowStripes: false } as const

function addSummarySheet(wb: ExcelJS.Workbook, stats: DashboardStatsRaw): void {
  const sheet = wb.addWorksheet('Summary')
  freezeHeaderRow(sheet)
  sheet.addTable({
    name: 'Summary',
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: TABLE_STYLE,
    columns: [{ name: 'Metric' }, { name: 'Value' }],
    rows: [
      ['Total Users', stats.totalUsers],
      ['New Users This Week', stats.newUsersThisWeek],
      ['Inactive Users', stats.inactiveUsers],
      ['Total Roles', stats.totalRoles],
      ['Total Permissions Assigned', stats.totalPermissionsAssigned],
      ['Total Permissions', stats.totalPermissions],
    ],
  })
  autoFitColumns(sheet)
}

function addUsersSheet(wb: ExcelJS.Workbook, users: UserExportRow[]): void {
  const sheet = wb.addWorksheet('Users')
  freezeHeaderRow(sheet)
  sheet.addTable({
    name: 'Users',
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: TABLE_STYLE,
    columns: [
      { name: 'ID' },
      { name: 'Full Name' },
      { name: 'Email' },
      { name: 'Active' },
      { name: 'Roles' },
      { name: 'Created At' },
    ],
    rows: users.map((u) => [u.id, u.fullName, u.email, u.isActive, u.roles.join(', '), u.createdAt]),
  })
  autoFitColumns(sheet)
}

function addRolesSheet(wb: ExcelJS.Workbook, roles: RoleExportRow[]): void {
  const sheet = wb.addWorksheet('Roles')
  freezeHeaderRow(sheet)
  sheet.addTable({
    name: 'Roles',
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: TABLE_STYLE,
    columns: [{ name: 'ID' }, { name: 'Name' }, { name: 'Permissions Count' }],
    rows: roles.map((r) => [r.id, r.name, r.permissionCount]),
  })
  autoFitColumns(sheet)
}

export async function buildExportWorkbook(permissions: string[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  const sinceDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const stats = await repo.getDashboardStats(sinceDate)

  addSummarySheet(wb, stats)

  if (permissions.includes('users:read')) {
    addUsersSheet(wb, await userRepo.findAllUsersForExport())
  }

  if (permissions.includes('roles:read')) {
    addRolesSheet(wb, await roleRepo.findAllRolesForExport())
  }

  return Buffer.from(await wb.xlsx.writeBuffer())
}

/**
 * Fetches dashboard statistics for the last 7 days and maps raw DB data to DTO.
 * Converts Date objects to ISO 8601 strings for serialization.
 */
export async function getDashboardStats(): Promise<ApiResponse<DashboardStatsDto>> {
  const sinceDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const raw = await repo.getDashboardStats(sinceDate)

  return {
    success: true,
    data: {
      totalUsers: raw.totalUsers,
      newUsersThisWeek: raw.newUsersThisWeek,
      inactiveUsers: raw.inactiveUsers,
      totalRoles: raw.totalRoles,
      totalPermissionsAssigned: raw.totalPermissionsAssigned,
      totalPermissions: raw.totalPermissions,
      recentActivity: raw.recentActivity.map((item) => ({
        id: item.id,
        action: item.action,
        resourceType: item.resourceType,
        resourceId: item.resourceId,
        userName: item.userName,
        createdAt: item.createdAt.toISOString(),
      })),
    },
    message: null,
  }
}
