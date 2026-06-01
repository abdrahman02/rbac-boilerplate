import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    emailVerificationToken: {
      create: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import type { EmailVerificationToken } from "../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { createToken, findByTokenHash, invalidateUserTokens } from "../email-verification.repository.js";

const EXPIRES_AT = new Date(Date.now() + 24 * 60 * 60 * 1000);

const MOCK_TOKEN: EmailVerificationToken = {
  id: 1,
  userId: 1,
  tokenHash: "abc123hash",
  expiresAt: EXPIRES_AT,
  usedAt: null,
  createdAt: new Date(),
};

describe("createToken", () => {
  beforeEach(() => vi.resetAllMocks());

  it("creates token record with correct data", async () => {
    vi.mocked(prisma.emailVerificationToken.create).mockResolvedValueOnce(MOCK_TOKEN);

    await createToken(1, "abc123hash", EXPIRES_AT);

    expect(prisma.emailVerificationToken.create).toHaveBeenCalledWith({
      data: { userId: 1, tokenHash: "abc123hash", expiresAt: EXPIRES_AT },
    });
  });
});

describe("findByTokenHash", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns token when found", async () => {
    vi.mocked(prisma.emailVerificationToken.findFirst).mockResolvedValueOnce(MOCK_TOKEN);

    const result = await findByTokenHash("abc123hash");

    expect(prisma.emailVerificationToken.findFirst).toHaveBeenCalledWith({
      where: { tokenHash: "abc123hash" },
    });
    expect(result).toEqual(MOCK_TOKEN);
  });

  it("returns null when token not found", async () => {
    vi.mocked(prisma.emailVerificationToken.findFirst).mockResolvedValueOnce(null);

    const result = await findByTokenHash("nonexistent");

    expect(result).toBeNull();
  });
});

describe("invalidateUserTokens", () => {
  beforeEach(() => vi.resetAllMocks());

  it("sets usedAt on all active tokens for the user", async () => {
    vi.mocked(prisma.emailVerificationToken.updateMany).mockResolvedValueOnce({ count: 2 });

    await invalidateUserTokens(1);

    expect(prisma.emailVerificationToken.updateMany).toHaveBeenCalledWith({
      where: { userId: 1, usedAt: null },
      data: { usedAt: expect.any(Date) },
    });
  });
});
