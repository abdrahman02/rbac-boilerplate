import type ExcelJS from "exceljs";

const COL_PADDING = 2;
const MIN_COL_WIDTH = 8;
const MAX_COL_WIDTH = 50;

export function freezeHeaderRow(sheet: ExcelJS.Worksheet): void {
  sheet.views = [{ state: "frozen", ySplit: 1 }];
}

export function autoFitColumns(sheet: ExcelJS.Worksheet): void {
  const widths: Record<number, number> = {};

  sheet.eachRow((row) => {
    row.eachCell({ includeEmpty: false }, (cell, col) => {
      const text = cell.value instanceof Date ? cell.value.toLocaleDateString() : String(cell.value ?? "");
      widths[col] = Math.max(widths[col] ?? 0, text.length);
    });
  });

  for (const [col, maxLen] of Object.entries(widths)) {
    const width = Math.min(Math.max(maxLen + COL_PADDING, MIN_COL_WIDTH), MAX_COL_WIDTH);
    sheet.getColumn(Number(col)).width = width;
  }
}
