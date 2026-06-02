import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    $transaction: vi.fn(),
    permission: { findMany: vi.fn(), count: vi.fn() },
  },
}));

import { prisma } from "../../lib/prisma.js";
import { findAllPermissions } from "../permission.repository.js";

describe("findAllPermissions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sorts by updatedAt descending", async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([0, []] as never);

    await findAllPermissions(1, 10);

    expect(prisma.permission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { updatedAt: "desc" } }),
    );
  });
});
