import { describe, expect, it } from "vitest";
import { PAGINATION } from "../../constants/pagination.js";
import { parseId, parsePagination, parseQueryString } from "../request-parser.js";

describe("parseId", () => {
  it("returns the numeric id for a valid numeric string", () => {
    expect(parseId("42")).toBe(42);
  });

  it("returns null for a non-numeric string", () => {
    expect(parseId("abc")).toBeNull();
  });

  it("returns null when the value is not a string", () => {
    expect(parseId(undefined)).toBeNull();
    expect(parseId(123)).toBeNull();
  });
});

describe("parseQueryString", () => {
  it("returns the trimmed string when it has content", () => {
    expect(parseQueryString("  admin  ")).toBe("admin");
  });

  it("returns undefined for an empty or whitespace-only string", () => {
    expect(parseQueryString("   ")).toBeUndefined();
    expect(parseQueryString("")).toBeUndefined();
  });

  it("returns undefined when the value is not a string", () => {
    expect(parseQueryString(undefined)).toBeUndefined();
    expect(parseQueryString(["a", "b"])).toBeUndefined();
  });
});

describe("parsePagination", () => {
  it("defaults to page 1 and the default limit when params are absent", () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: PAGINATION.DEFAULT_LIMIT });
  });

  it("parses provided page and limit values", () => {
    expect(parsePagination({ page: "3", limit: "25" })).toEqual({ page: 3, limit: 25 });
  });

  it("clamps the limit to the maximum allowed", () => {
    expect(parsePagination({ limit: "9999" })).toEqual({ page: 1, limit: PAGINATION.MAX_LIMIT });
  });

  it("forces page to at least 1 for zero or negative values", () => {
    expect(parsePagination({ page: "0" }).page).toBe(1);
    expect(parsePagination({ page: "-5" }).page).toBe(1);
  });

  it("preserves the unpaginated sentinel value for the limit", () => {
    expect(parsePagination({ limit: String(PAGINATION.UNPAGINATED) }).limit).toBe(PAGINATION.UNPAGINATED);
  });
});
