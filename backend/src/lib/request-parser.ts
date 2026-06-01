import { PAGINATION } from "../constants/pagination.js";

/**
 * Parses a value into a positive integer, returning null when it is not a
 * valid numeric string. Used to validate route params such as `:id`.
 */
export function parseId(value: unknown): number | null {
  if (typeof value !== "string") return null;

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Normalises a query string value: trims it and collapses empty input to
 * `undefined` so downstream filters can treat "no filter" uniformly.
 */
export function parseQueryString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

interface PaginationQuery {
  page?: unknown;
  limit?: unknown;
}

interface Pagination {
  page: number;
  limit: number;
}

/**
 * Derives a safe `{ page, limit }` pair from raw query params, applying
 * defaults and clamping. The `UNPAGINATED` sentinel is passed through untouched.
 */
export function parsePagination(query: PaginationQuery): Pagination {
  const page = Math.max(1, toInt(query.page) ?? 1);

  const rawLimit = toInt(query.limit) ?? PAGINATION.DEFAULT_LIMIT;
  const limit =
    rawLimit === PAGINATION.UNPAGINATED
      ? PAGINATION.UNPAGINATED
      : Math.min(PAGINATION.MAX_LIMIT, Math.max(PAGINATION.MIN_LIMIT, rawLimit));

  return { page, limit };
}

/**
 * Parses a value into an integer, returning null for non-numeric input.
 */
function toInt(value: unknown): number | null {
  if (typeof value !== "string") return null;

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}
