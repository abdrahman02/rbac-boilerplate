import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    passwordResetToken: {
      create: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import type { PasswordResetToken } from "../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import {
  consumeTokenAndResetPassword,
  createToken,
  findByTokenHash,
  invalidateUserTokens,
} from "../password-reset.repository.js";

const EXPIRES_AT = new Date(Date.now() + 30 * 60 * 1000);

const MOCK_TOKEN: PasswordResetToken = {
  id: 1,
  userId: 1,
  tokenHash: "abc123hash",
  isInvite: false,
  expiresAt: EXPIRES_AT,
  usedAt: null,
  createdAt: new Date(),
};

describe("createToken", () => {
  beforeEach(() => vi.resetAllMocks());

  it("creates token record with correct data", async () => {
    vi.mocked(prisma.passwordResetToken.create).mockResolvedValueOnce(MOCK_TOKEN);

    await createToken(1, "abc123hash", EXPIRES_AT);

    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
      data: { userId: 1, tokenHash: "abc123hash", expiresAt: EXPIRES_AT, isInvite: false },
    });
  });

  it("creates token with isInvite=true when flag is passed", async () => {
    vi.mocked(prisma.passwordResetToken.create).mockResolvedValueOnce({
      ...MOCK_TOKEN,
      isInvite: true,
    });

    await createToken(1, "abc123hash", EXPIRES_AT, true);

    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
      data: { userId: 1, tokenHash: "abc123hash", expiresAt: EXPIRES_AT, isInvite: true },
    });
  });

  it("defaults isInvite to false when flag is omitted", async () => {
    vi.mocked(prisma.passwordResetToken.create).mockResolvedValueOnce(MOCK_TOKEN);

    await createToken(1, "abc123hash", EXPIRES_AT);

    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
      data: { userId: 1, tokenHash: "abc123hash", expiresAt: EXPIRES_AT, isInvite: false },
    });
  });
});

describe("findByTokenHash", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns token when found", async () => {
    vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValueOnce(MOCK_TOKEN);

    const result = await findByTokenHash("abc123hash");

    expect(prisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
      where: { tokenHash: "abc123hash" },
    });
    expect(result).toEqual(MOCK_TOKEN);
  });

  it("returns null when token not found", async () => {
    vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValueOnce(null);

    const result = await findByTokenHash("nonexistent");

    expect(result).toBeNull();
  });
});

describe("invalidateUserTokens", () => {
  beforeEach(() => vi.resetAllMocks());

  it("sets usedAt on all active tokens for the user", async () => {
    vi.mocked(prisma.passwordResetToken.updateMany).mockResolvedValueOnce({ count: 1 });

    await invalidateUserTokens(1);

    expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith({
      where: { userId: 1, usedAt: null },
      data: { usedAt: expect.any(Date) },
    });
  });
});

describe("consumeTokenAndResetPassword", () => {
  beforeEach(() => vi.resetAllMocks());

  it("executes transaction to mark token used and update password hash", async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([undefined, undefined]);

    await consumeTokenAndResetPassword("abc123hash", 1, "newhash");

    expect(prisma.$transaction).toHaveBeenCalled();
    const callArgs = vi.mocked(prisma.$transaction).mock.calls[0]![0];
    expect(Array.isArray(callArgs)).toBe(true);
    expect(callArgs).toHaveLength(2);
  });

  it("activates user when activateUser=true", async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([]);

    await consumeTokenAndResetPassword("abc123hash", 1, "newhash", true);

    expect(prisma.$transaction).toHaveBeenCalledOnce();
  });

  it("does not activate user when activateUser=false (default)", async () => {
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([]);

    await consumeTokenAndResetPassword("abc123hash", 1, "newhash");

    expect(prisma.$transaction).toHaveBeenCalledOnce();
  });
});
