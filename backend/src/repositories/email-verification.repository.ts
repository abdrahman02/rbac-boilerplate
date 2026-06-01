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
