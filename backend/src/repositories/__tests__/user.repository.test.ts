import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    $transaction: vi.fn(),
    user: { findMany: vi.fn(), count: vi.fn() },
  },
}));

import { prisma } from "../../lib/prisma.js";
import { findAllUsers, findAllUsersForExport, findUsersForExport } from "../user.repository.js";

const CREATED_AT = new Date("2024-01-15T10:00:00.000Z");

describe("findAllUsersForExport", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns mapped UserExportRow array with roles as string[]", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      {
        id: 1,
        fullName: "Alice",
        email: "alice@example.com",
        isActive: true,
        createdAt: CREATED_AT,
        roles: [{ role: { name: "admin" } }],
      },
    ] as never);

    const result = await findAllUsersForExport();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 1,
      fullName: "Alice",
      email: "alice@example.com",
      isActive: true,
      roles: ["admin"],
      createdAt: CREATED_AT,
    });
  });

  it("maps user with no roles to empty roles array", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      {
        id: 2,
        fullName: "Bob",
        email: "bob@example.com",
        isActive: false,
        createdAt: CREATED_AT,
        roles: [],
      },
    ] as never);

    const result = await findAllUsersForExport();

    expect(result[0]?.roles).toEqual([]);
    expect(result[0]?.isActive).toBe(false);
  });

  it("returns empty array when no users exist", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    const result = await findAllUsersForExport();

    expect(result).toEqual([]);
  });

  it("sorts by updatedAt descending", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    await findAllUsersForExport();

    expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { updatedAt: "desc" } }));
  });
});

describe("findAllUsers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sorts by updatedAt descending", async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([0, []] as never);

    await findAllUsers(1, 10);

    expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { updatedAt: "desc" } }));
  });
});

describe("findUsersForExport", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sorts by updatedAt descending", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    await findUsersForExport();

    expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { updatedAt: "desc" } }));
  });
});
