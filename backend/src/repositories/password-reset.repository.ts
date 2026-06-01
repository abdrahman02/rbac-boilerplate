import type { PasswordResetToken } from "../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export async function createToken(
  userId: number,
  tokenHash: string,
  expiresAt: Date,
  isInvite = false,
): Promise<void> {
  await prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt, isInvite },
  });
}

export async function findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
  return prisma.passwordResetToken.findFirst({
    where: { tokenHash },
  });
}

export async function invalidateUserTokens(userId: number): Promise<void> {
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
}

/**
 * Atomically marks the reset token as used AND updates the user's password
 * in a single transaction. Prevents partial failure where the token is consumed
 * but the password is not updated (or vice-versa).
 *
 * When `activateUser` is true (e.g. for invite flows), the user's
 * `emailVerifiedAt` and `isActive` fields are also set in the same transaction.
 */
export async function consumeTokenAndResetPassword(
  tokenHash: string,
  userId: number,
  passwordHash: string,
  activateUser = false,
): Promise<void> {
  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { tokenHash },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        ...(activateUser && { emailVerifiedAt: new Date(), isActive: true }),
      },
    }),
  ]);
}
