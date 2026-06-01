import type { PasswordResetToken } from "../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export async function createToken(userId: number, tokenHash: string, expiresAt: Date): Promise<void> {
  await prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt },
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
 */
export async function consumeTokenAndResetPassword(
  tokenHash: string,
  userId: number,
  passwordHash: string,
): Promise<void> {
  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { tokenHash },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    }),
  ]);
}
