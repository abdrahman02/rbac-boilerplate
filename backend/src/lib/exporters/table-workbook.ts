import ExcelJS from "exceljs";
import { autoFitColumns, freezeHeaderRow } from "../excel-styles.js";

/** Primitive cell values ExcelJS can render directly in a table. */
export type CellValue = string | number | boolean | Date | null;

export interface TableSheet {
  sheetName: string;
  tableName: string;
  columns: string[];
  rows: CellValue[][];
}

const TABLE_STYLE = { theme: "TableStyleMedium2", showRowStripes: false } as const;

/**
 * Adds a single styled table sheet (frozen header + auto-fit columns) to the workbook.
 */
export function addTableSheet(workbook: ExcelJS.Workbook, table: TableSheet): void {
  const sheet = workbook.addWorksheet(table.sheetName);
  freezeHeaderRow(sheet);
  sheet.addTable({
    name: table.tableName,
    ref: "A1",
    headerRow: true,
    totalsRow: false,
    style: TABLE_STYLE,
    columns: table.columns.map((name) => ({ name })),
    rows: table.rows,
  });
  autoFitColumns(sheet);
}

/**
 * Builds an `.xlsx` workbook from one or more table sheets and returns it as a Buffer.
 */
export async function buildWorkbook(tables: TableSheet[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  for (const table of tables) {
    addTableSheet(workbook, table);
  }
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
