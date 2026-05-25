import ExcelJS from 'exceljs'
import * as repo from '../repositories/dashboard.repository.js'
import * as userRepo from '../repositories/user.repository.js'
import * as roleRepo from '../repositories/role.repository.js'
import {
  styleHeaderRow,
  styleDataRow,
  freezeHeaderRow,
  autoFitColumns,
} from '../lib/excel-styles.js'
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

function addSummarySheet(wb: ExcelJS.Workbook, stats: DashboardStatsRaw): void {
  const sheet = wb.addWorksheet('Summary')
  freezeHeaderRow(sheet)
  styleHeaderRow(sheet.addRow(['Metric', 'Value']))
  styleDataRow(sheet.addRow(['Total Users', stats.totalUsers]))
  styleDataRow(sheet.addRow(['New Users This Week', stats.newUsersThisWeek]))
  styleDataRow(sheet.addRow(['Inactive Users', stats.inactiveUsers]))
  styleDataRow(sheet.addRow(['Total Roles', stats.totalRoles]))
  styleDataRow(sheet.addRow(['Total Permissions Assigned', stats.totalPermissionsAssigned]))
  styleDataRow(sheet.addRow(['Total Permissions', stats.totalPermissions]))
  autoFitColumns(sheet)
}

function addUsersSheet(wb: ExcelJS.Workbook, users: UserExportRow[]): void {
  const sheet = wb.addWorksheet('Users')
  freezeHeaderRow(sheet)
  styleHeaderRow(sheet.addRow(['ID', 'Full Name', 'Email', 'Active', 'Roles', 'Created At']))
  for (const u of users) {
    styleDataRow(sheet.addRow([u.id, u.fullName, u.email, u.isActive, u.roles.join(', '), u.createdAt]))
  }
  autoFitColumns(sheet)
}

function addRolesSheet(wb: ExcelJS.Workbook, roles: RoleExportRow[]): void {
  const sheet = wb.addWorksheet('Roles')
  freezeHeaderRow(sheet)
  styleHeaderRow(sheet.addRow(['ID', 'Name', 'Permissions Count']))
  for (const r of roles) {
    styleDataRow(sheet.addRow([r.id, r.name, r.permissionCount]))
  }
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
