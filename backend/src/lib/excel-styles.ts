import type ExcelJS from 'exceljs'

// Design palette: professional deep navy with clean neutral borders
const COLORS = {
  headerBg: 'FF1E3A5F',     // Deep navy
  headerText: 'FFFFFFFF',   // White
  borderAccent: 'FF2D5A8E', // Navy accent
  borderLight: 'FFD0D7E2',  // Light grey-blue
} as const

const COL_PADDING = 2
const MIN_COL_WIDTH = 8
const MAX_COL_WIDTH = 50

// ── Row styling ────────────────────────────────────────────────────────────────
// Styles are applied per-cell (not per-row) so that fill and borders are scoped
// exactly to columns that have content — row-level styles span all 16K columns.

export function styleHeaderRow(row: ExcelJS.Row): void {
  row.height = 20
  const colCount = (row.values as unknown[]).length - 1
  for (let col = 1; col <= colCount; col++) {
    const cell = row.getCell(col)
    cell.font = { name: 'Calibri', bold: true, color: { argb: COLORS.headerText }, size: 11 }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } }
    cell.alignment = { vertical: 'middle', horizontal: 'left' }
    cell.border = {
      top: { style: 'thin', color: { argb: COLORS.borderAccent } },
      left: { style: 'thin', color: { argb: COLORS.borderAccent } },
      bottom: { style: 'thin', color: { argb: COLORS.borderAccent } },
      right: { style: 'thin', color: { argb: COLORS.borderAccent } },
    }
  }
}

export function styleDataRow(row: ExcelJS.Row): void {
  row.height = 18
  const colCount = (row.values as unknown[]).length - 1
  for (let col = 1; col <= colCount; col++) {
    const cell = row.getCell(col)
    cell.font = { name: 'Calibri', size: 10 }
    cell.alignment = { vertical: 'middle' }
    cell.border = {
      top: { style: 'thin', color: { argb: COLORS.borderLight } },
      left: { style: 'thin', color: { argb: COLORS.borderLight } },
      bottom: { style: 'thin', color: { argb: COLORS.borderLight } },
      right: { style: 'thin', color: { argb: COLORS.borderLight } },
    }
  }
}

// ── Sheet-level helpers ────────────────────────────────────────────────────────

export function freezeHeaderRow(sheet: ExcelJS.Worksheet): void {
  sheet.views = [{ state: 'frozen', ySplit: 1 }]
}

export function autoFitColumns(sheet: ExcelJS.Worksheet): void {
  const widths: Record<number, number> = {}

  sheet.eachRow((row) => {
    row.eachCell({ includeEmpty: false }, (cell, col) => {
      const text =
        cell.value instanceof Date
          ? cell.value.toLocaleDateString()
          : String(cell.value ?? '')
      widths[col] = Math.max(widths[col] ?? 0, text.length)
    })
  })

  for (const [col, maxLen] of Object.entries(widths)) {
    const width = Math.min(Math.max(maxLen + COL_PADDING, MIN_COL_WIDTH), MAX_COL_WIDTH)
    sheet.getColumn(Number(col)).width = width
  }
}
