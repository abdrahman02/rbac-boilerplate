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

/**
 * Row mock whose style functions access cells via getCell(col) and
 * derive column count from values.length - 1 (1-indexed ExcelJS convention).
 */
function makeMockRow(cellValues: unknown[]) {
  const mockCells: MockCell[] = cellValues.map(() => ({}))
  return {
    height: 0 as number,
    values: [null, ...cellValues] as unknown[], // 1-indexed; index 0 is null
    getCell(col: number) {
      return mockCells[col - 1] as unknown as ExcelJS.Cell
    },
    cells: mockCells,
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
  it('applies navy fill and white bold Calibri font to each data cell', () => {
    const row = makeMockRow(['Metric', 'Value'])
    styleHeaderRow(row as unknown as ExcelJS.Row)

    for (const cell of row.cells) {
      expect((cell.font as ExcelJS.Font).bold).toBe(true)
      expect((cell.font as ExcelJS.Font).name).toBe('Calibri')
      expect((cell.font as ExcelJS.Font).size).toBe(11)
      expect((cell.font as ExcelJS.Font).color).toEqual({ argb: 'FFFFFFFF' })
      expect((cell.fill as ExcelJS.FillPattern).pattern).toBe('solid')
      expect((cell.fill as ExcelJS.FillPattern).fgColor).toEqual({ argb: 'FF1E3A5F' })
    }
  })

  it('sets thin border on all sides of each header cell', () => {
    const row = makeMockRow(['ID', 'Name', 'Email'])
    styleHeaderRow(row as unknown as ExcelJS.Row)

    for (const cell of row.cells) {
      const border = cell.border as ExcelJS.Borders
      expect(border.top?.style).toBe('thin')
      expect(border.left?.style).toBe('thin')
      expect(border.bottom?.style).toBe('thin')
      expect(border.right?.style).toBe('thin')
    }
  })

  it('styles exactly the data columns — no overflow beyond column count', () => {
    const row = makeMockRow(['A', 'B']) // only 2 columns
    styleHeaderRow(row as unknown as ExcelJS.Row)

    expect(row.cells).toHaveLength(2)
    expect(row.cells[0]?.fill).toBeDefined()
    expect(row.cells[1]?.fill).toBeDefined()
  })

  it('sets row height to 20', () => {
    const row = makeMockRow(['X'])
    styleHeaderRow(row as unknown as ExcelJS.Row)
    expect(row.height).toBe(20)
  })
})

// ── styleDataRow ───────────────────────────────────────────────────────────────

describe('styleDataRow', () => {
  it('applies Calibri size-10 font to each data cell', () => {
    const row = makeMockRow([1, 'Alice', 'alice@example.com', true, 'admin', new Date()])
    styleDataRow(row as unknown as ExcelJS.Row)

    for (const cell of row.cells) {
      expect((cell.font as ExcelJS.Font).name).toBe('Calibri')
      expect((cell.font as ExcelJS.Font).size).toBe(10)
    }
  })

  it('sets thin border on all sides of each cell', () => {
    const row = makeMockRow([1, 'Alice', 'alice@example.com'])
    styleDataRow(row as unknown as ExcelJS.Row)

    for (const cell of row.cells) {
      const border = cell.border as ExcelJS.Borders
      expect(border.top?.style).toBe('thin')
      expect(border.left?.style).toBe('thin')
      expect(border.bottom?.style).toBe('thin')
      expect(border.right?.style).toBe('thin')
    }
  })

  it('styles exactly the data columns — no overflow', () => {
    const row = makeMockRow([1, 'text']) // only 2 columns
    styleDataRow(row as unknown as ExcelJS.Row)

    expect(row.cells).toHaveLength(2)
    expect(row.cells[0]?.border).toBeDefined()
    expect(row.cells[1]?.border).toBeDefined()
  })

  it('sets row height to 18', () => {
    const row = makeMockRow(['X'])
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

    expect(sheet.cols[1]?.width).toBe(8)  // max(4,5)+2=7 → MIN 8
    expect(sheet.cols[2]?.width).toBe(19) // max(5,17)+2=19
  })

  it('respects MIN_COL_WIDTH of 8', () => {
    const sheet = makeMockSheet([[{ value: 'ID' }, { value: '1' }]])
    autoFitColumns(sheet as unknown as ExcelJS.Worksheet)
    expect(sheet.cols[1]?.width).toBe(8)
    expect(sheet.cols[2]?.width).toBe(8)
  })

  it('caps width at MAX_COL_WIDTH of 50', () => {
    const sheet = makeMockSheet([[{ value: 'x'.repeat(60) }]])
    autoFitColumns(sheet as unknown as ExcelJS.Worksheet)
    expect(sheet.cols[1]?.width).toBe(50)
  })

  it('converts Date values to string before measuring', () => {
    const date = new Date('2024-01-15')
    const sheet = makeMockSheet([[{ value: date }]])
    autoFitColumns(sheet as unknown as ExcelJS.Worksheet)
    const expected = Math.min(Math.max(date.toLocaleDateString().length + 2, 8), 50)
    expect(sheet.cols[1]?.width).toBe(expected)
  })

  it('does nothing when sheet has no rows', () => {
    const sheet = makeMockSheet([])
    autoFitColumns(sheet as unknown as ExcelJS.Worksheet)
    expect(Object.keys(sheet.cols)).toHaveLength(0)
  })
})
