import { describe, expect, it, vi } from "vitest";

const addTableMock = vi.fn();
const addWorksheetMock = vi.fn(() => ({
  addTable: addTableMock,
  eachRow: vi.fn(),
  getColumn: vi.fn(() => ({ width: 0 })),
  views: [],
}));
const writeBufferMock = vi.fn().mockResolvedValue(Buffer.from("xlsx"));

vi.mock("exceljs", () => ({
  default: {
    // biome-ignore lint/complexity/useArrowFunction: must be a constructable function for `new Workbook()`
    Workbook: vi.fn(function () {
      return {
        addWorksheet: addWorksheetMock,
        xlsx: { writeBuffer: writeBufferMock },
      };
    }),
  },
}));

const { buildWorkbook } = await import("../table-workbook.js");

describe("buildWorkbook", () => {
  it("returns a Buffer", async () => {
    const result = await buildWorkbook([{ sheetName: "S", tableName: "T", columns: ["A"], rows: [["x"]] }]);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it("adds one worksheet per table config", async () => {
    addWorksheetMock.mockClear();
    await buildWorkbook([
      { sheetName: "One", tableName: "One", columns: ["A"], rows: [] },
      { sheetName: "Two", tableName: "Two", columns: ["B"], rows: [] },
    ]);
    expect(addWorksheetMock).toHaveBeenCalledTimes(2);
    expect(addWorksheetMock).toHaveBeenNthCalledWith(1, "One");
    expect(addWorksheetMock).toHaveBeenNthCalledWith(2, "Two");
  });

  it("maps column names to ExcelJS column objects and forwards rows", async () => {
    addTableMock.mockClear();
    await buildWorkbook([{ sheetName: "S", tableName: "T", columns: ["Name", "Email"], rows: [["a", "b"]] }]);
    expect(addTableMock).toHaveBeenCalledTimes(1);
    const tableArg = addTableMock.mock.calls[0]?.[0];
    expect(tableArg.columns).toEqual([{ name: "Name" }, { name: "Email" }]);
    expect(tableArg.rows).toEqual([["a", "b"]]);
  });
});
