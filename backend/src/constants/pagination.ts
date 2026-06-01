/**
 * Shared pagination bounds used by request parsing and services.
 * `UNPAGINATED` is the sentinel callers pass to request every row (used by exports).
 */
export const PAGINATION = {
  MIN_LIMIT: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  UNPAGINATED: -1,
} as const;
