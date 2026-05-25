import { describe, it, expect } from 'vitest'
import type ExcelJS from 'exceljs'
import {
  styleHeaderRow,
  styleDataRow,
  freezeHeaderRow,
  autoFitColumns,
} from '../excel-styles.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

type MockCell = Record<string, unknown>

/** Row mock with N cells; styles are applied per-cell via eachCell. */
function makeMockRow(cellCount = 2) {
  const cells: MockCell[] = Array.from({ length: cellCount }, () => ({}))
  return {
    height: 0 as number,
    eachCell(
      _opts: { includeEmpty: boolean },
      cb: (cell: ExcelJS.Cell, col: number) => void,
    ) {
      cells.forEach((cell, i) => cb(cell as unknown as ExcelJS.Cell, i + 1))
    },
    cells,
  }
}

interface MockColumnStore {
  [col: number]: { width: number }
}

function makeMockSheet(rows: Array<Array<{ value: unknown }>>) {
  const cols: MockColumnStore = {}
  return {
    eachRow(cb: (row: ExcelJS.Row, rowNumber: number) => void) {
      rows.forEach((cells, rowIdx) => {
        const row = {
          eachCell(
            _opts: { includeEmpty: boolean },
            cellCb: (cell: ExcelJS.Cell, col: number) => void,
          ) {
            cells.forEach((cell, colIdx) => cellCb(cell as unknown as ExcelJS.Cell, colIdx + 1))
          },
        }
        cb(row as unknown as ExcelJS.Row, rowIdx + 1)
      })
    },
    getColumn(col: number) {
      if (!cols[col]) cols[col] = { width: 0 }
      return cols[col]
    },
    cols,
  }
}

// ── styleHeaderRow ─────────────────────────────────────────────────────────────

describe('styleHeaderRow', () => {
  it('applies navy fill and white bold font to each cell', () => {
    const row = makeMockRow(3)
    styleHeaderRow(row as unknown as ExcelJS.Row)

    for (const cell of row.cells) {
      expect((cell.font as ExcelJS.Font).bold).toBe(true)
      expect((cell.font as ExcelJS.Font).color).toEqual({ argb: 'FFFFFFFF' })
      expect((cell.fill as ExcelJS.FillPattern).pattern).toBe('solid')
      expect((cell.fill as ExcelJS.FillPattern).fgColor).toEqual({ argb: 'FF1E3A5F' })
    }
  })

  it('sets font family and size on each header cell', () => {
    const row = makeMockRow(2)
    styleHeaderRow(row as unknown as ExcelJS.Row)

    for (const cell of row.cells) {
      expect((cell.font as ExcelJS.Font).name).toBe('Calibri')
      expect((cell.font as ExcelJS.Font).size).toBe(11)
    }
  })

  it('sets border with medium bottom weight on each cell', () => {
    const row = makeMockRow(2)
    styleHeaderRow(row as unknown as ExcelJS.Row)

    for (const cell of row.cells) {
      expect((cell.border as ExcelJS.Borders).bottom?.style).toBe('medium')
      expect((cell.border as ExcelJS.Borders).top?.style).toBe('thin')
      expect((cell.border as ExcelJS.Borders).left?.style).toBe('thin')
      expect((cell.border as ExcelJS.Borders).right?.style).toBe('thin')
    }
  })

  it('sets row height to 20', () => {
    const row = makeMockRow()
    styleHeaderRow(row as unknown as ExcelJS.Row)
    expect(row.height).toBe(20)
  })
})

// ── styleDataRow ───────────────────────────────────────────────────────────────

describe('styleDataRow', () => {
  it('applies Calibri font with size 10 to each cell', () => {
    const row = makeMockRow(3)
    styleDataRow(row as unknown as ExcelJS.Row)

    for (const cell of row.cells) {
      expect((cell.font as ExcelJS.Font).name).toBe('Calibri')
      expect((cell.font as ExcelJS.Font).size).toBe(10)
    }
  })

  it('sets thin border on all sides of each cell', () => {
    const row = makeMockRow(2)
    styleDataRow(row as unknown as ExcelJS.Row)

    for (const cell of row.cells) {
      const border = cell.border as ExcelJS.Borders
      expect(border.top?.style).toBe('thin')
      expect(border.left?.style).toBe('thin')
      expect(border.bottom?.style).toBe('thin')
      expect(border.right?.style).toBe('thin')
    }
  })

  it('sets row height to 18', () => {
    const row = makeMockRow()
    styleDataRow(row as unknown as ExcelJS.Row)
    expect(row.height).toBe(18)
  })
})

// ── freezeHeaderRow ────────────────────────────────────────────────────────────

describe('freezeHeaderRow', () => {
  it('sets frozen view splitting at row 1', () => {
    const sheet: Record<string, unknown> = {}
    freezeHeaderRow(sheet as unknown as ExcelJS.Worksheet)
    expect(sheet.views).toEqual([{ state: 'frozen', ySplit: 1 }])
  })
})

// ── autoFitColumns ─────────────────────────────────────────────────────────────

describe('autoFitColumns', () => {
  it('sets width to content length + padding', () => {
    const sheet = makeMockSheet([
      [{ value: 'Name' }, { value: 'Email' }],
      [{ value: 'Alice' }, { value: 'alice@example.com' }],
    ])

    autoFitColumns(sheet as unknown as ExcelJS.Worksheet)

    // col 1: max('Name'=4, 'Alice'=5) + 2 = 7 → clamped to MIN 8
    expect(sheet.cols[1]?.width).toBe(8)
    // col 2: max('Email'=5, 'alice@example.com'=17) + 2 = 19
    expect(sheet.cols[2]?.width).toBe(19)
  })

  it('respects MIN_COL_WIDTH of 8', () => {
    const sheet = makeMockSheet([[{ value: 'ID' }, { value: '1' }]])

    autoFitColumns(sheet as unknown as ExcelJS.Worksheet)

    expect(sheet.cols[1]?.width).toBe(8)
    expect(sheet.cols[2]?.width).toBe(8)
  })

  it('caps width at MAX_COL_WIDTH of 50', () => {
    const longValue = 'x'.repeat(60)
    const sheet = makeMockSheet([[{ value: longValue }]])

    autoFitColumns(sheet as unknown as ExcelJS.Worksheet)

    expect(sheet.cols[1]?.width).toBe(50)
  })

  it('converts Date values to string before measuring', () => {
    const date = new Date('2024-01-15')
    const sheet = makeMockSheet([[{ value: date }]])

    autoFitColumns(sheet as unknown as ExcelJS.Worksheet)

    const dateStr = date.toLocaleDateString()
    const expected = Math.min(Math.max(dateStr.length + 2, 8), 50)
    expect(sheet.cols[1]?.width).toBe(expected)
  })

  it('does nothing when sheet has no rows', () => {
    const sheet = makeMockSheet([])

    autoFitColumns(sheet as unknown as ExcelJS.Worksheet)

    expect(Object.keys(sheet.cols)).toHaveLength(0)
  })
})
