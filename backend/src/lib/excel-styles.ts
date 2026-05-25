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

export function styleHeaderRow(row: ExcelJS.Row): void {
  row.font = { bold: true, color: { argb: COLORS.headerText }, size: 11 }
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } }
  row.alignment = { vertical: 'middle', horizontal: 'left' }
  row.border = {
    top: { style: 'thin', color: { argb: COLORS.borderAccent } },
    left: { style: 'thin', color: { argb: COLORS.borderAccent } },
    bottom: { style: 'medium', color: { argb: COLORS.borderAccent } },
    right: { style: 'thin', color: { argb: COLORS.borderAccent } },
  }
  row.height = 20
}

export function styleDataRow(row: ExcelJS.Row): void {
  row.alignment = { vertical: 'middle' }
  row.border = {
    top: { style: 'thin', color: { argb: COLORS.borderLight } },
    left: { style: 'thin', color: { argb: COLORS.borderLight } },
    bottom: { style: 'thin', color: { argb: COLORS.borderLight } },
    right: { style: 'thin', color: { argb: COLORS.borderLight } },
  }
  row.height = 18
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
