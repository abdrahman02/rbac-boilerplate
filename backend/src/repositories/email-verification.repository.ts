import type { EmailVerificationToken } from "../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export async function createToken(userId: number, tokenHash: string, expiresAt: Date): Promise<void> {
  await prisma.emailVerificationToken.create({
    data: { userId, tokenHash, expiresAt },
  });
}

export async function findByTokenHash(tokenHash: string): Promise<EmailVerificationToken | null> {
  return prisma.emailVerificationToken.findFirst({
    where: { tokenHash },
  });
}

export async function invalidateUserTokens(userId: number): Promise<void> {
  await prisma.emailVerificationToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
}

export async function markTokenUsed(tokenHash: string): Promise<void> {
  await prisma.emailVerificationToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });
}

/**
 * Atomically marks the verification token as used AND activates the user's account
 * in a single database transaction. Prevents the race condition where a token could
 * be marked used but the user account left inactive (or vice-versa) on partial failure.
 */
export async function consumeTokenAndActivateUser(tokenHash: string, userId: number): Promise<void> {
  await prisma.$transaction([
    prisma.emailVerificationToken.update({
      where: { tokenHash },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      // Activate the account at the same time as marking email verified —
      // users register with isActive=false and become active only after verification.
      data: { emailVerifiedAt: new Date(), isActive: true },
    }),
  ]);
}
