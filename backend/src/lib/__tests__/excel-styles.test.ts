import type ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { autoFitColumns, freezeHeaderRow } from "../excel-styles.js";

// ── freezeHeaderRow ────────────────────────────────────────────────────────────

describe("freezeHeaderRow", () => {
  it("sets frozen view splitting at row 1", () => {
    const sheet: Record<string, unknown> = {};
    freezeHeaderRow(sheet as unknown as ExcelJS.Worksheet);
    expect(sheet.views).toEqual([{ state: "frozen", ySplit: 1 }]);
  });
});

// ── autoFitColumns ─────────────────────────────────────────────────────────────

interface MockColumnStore {
  [col: number]: { width: number };
}

function makeMockSheet(rows: Array<Array<{ value: unknown }>>) {
  const cols: MockColumnStore = {};
  return {
    eachRow(cb: (row: ExcelJS.Row, rowNumber: number) => void) {
      rows.forEach((cells, rowIdx) => {
        const row = {
          eachCell(_opts: { includeEmpty: boolean }, cellCb: (cell: ExcelJS.Cell, col: number) => void) {
            cells.forEach((cell, colIdx) => {
              cellCb(cell as unknown as ExcelJS.Cell, colIdx + 1);
            });
          },
        };
        cb(row as unknown as ExcelJS.Row, rowIdx + 1);
      });
    },
    getColumn(col: number) {
      if (!cols[col]) cols[col] = { width: 0 };
      return cols[col];
    },
    cols,
  };
}

describe("autoFitColumns", () => {
  it("sets width to content length + padding", () => {
    const sheet = makeMockSheet([
      [{ value: "Name" }, { value: "Email" }],
      [{ value: "Alice" }, { value: "alice@example.com" }],
    ]);

    autoFitColumns(sheet as unknown as ExcelJS.Worksheet);

    expect(sheet.cols[1]?.width).toBe(8); // max(4,5)+2=7 → MIN 8
    expect(sheet.cols[2]?.width).toBe(19); // max(5,17)+2=19
  });

  it("respects MIN_COL_WIDTH of 8", () => {
    const sheet = makeMockSheet([[{ value: "ID" }, { value: "1" }]]);
    autoFitColumns(sheet as unknown as ExcelJS.Worksheet);
    expect(sheet.cols[1]?.width).toBe(8);
    expect(sheet.cols[2]?.width).toBe(8);
  });

  it("caps width at MAX_COL_WIDTH of 50", () => {
    const sheet = makeMockSheet([[{ value: "x".repeat(60) }]]);
    autoFitColumns(sheet as unknown as ExcelJS.Worksheet);
    expect(sheet.cols[1]?.width).toBe(50);
  });

  it("converts Date values to string before measuring", () => {
    const date = new Date("2024-01-15");
    const sheet = makeMockSheet([[{ value: date }]]);
    autoFitColumns(sheet as unknown as ExcelJS.Worksheet);
    const expected = Math.min(Math.max(date.toLocaleDateString().length + 2, 8), 50);
    expect(sheet.cols[1]?.width).toBe(expected);
  });

  it("does nothing when sheet has no rows", () => {
    const sheet = makeMockSheet([]);
    autoFitColumns(sheet as unknown as ExcelJS.Worksheet);
    expect(Object.keys(sheet.cols)).toHaveLength(0);
  });
});
