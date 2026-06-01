import * as emailVerifRepo from "../repositories/email-verification.repository.js";
import * as authRepo from "../repositories/auth.repository.js";
import type { ChangePasswordInput, LoginInput, RegisterInput, UpdateMeInput } from "../schemas/auth.schema.js";
import type { AuthenticatedUser } from "../types/index.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import * as emailSvc from "./email.service.js";
import * as tokenSvc from "./token.service.js";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface AuthResult {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterUserResult {
  id: number;
  name: string;
  email: string;
}

export async function register(input: RegisterInput): Promise<RegisterUserResult> {
  const existing = await authRepo.findUserByEmail(input.email);
  if (existing) throw new Error("EMAIL_TAKEN");

  const passwordHash = await hashPassword(input.password);
  const userId = await authRepo.createUser(input.name, input.email, passwordHash);
  await authRepo.assignDefaultRole(userId);

  const rawToken = tokenSvc.generateVerificationToken();
  const tokenHash = tokenSvc.hashVerificationToken(rawToken);
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  await emailVerifRepo.createToken(userId, tokenHash, expiresAt);
  await emailSvc.sendVerificationEmail(input.email, input.name, rawToken);

  return { id: userId, name: input.name, email: input.email };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await authRepo.findUserByEmail(input.email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  // emailVerifiedAt checked before isActive: unverified users get EMAIL_NOT_VERIFIED (actionable),
  // not ACCOUNT_DISABLED. isActive=false on verified accounts means admin explicitly disabled it.
  if (!user.emailVerifiedAt) throw new Error("EMAIL_NOT_VERIFIED");
  if (!user.isActive) throw new Error("ACCOUNT_DISABLED");

  return buildAuthResult(user.id);
}

export async function verifyEmail(token: string): Promise<AuthResult> {
  const tokenHash = tokenSvc.hashVerificationToken(token);
  const record = await emailVerifRepo.findByTokenHash(tokenHash);

  if (!record || record.usedAt !== null) throw new Error("INVALID_VERIFICATION_TOKEN");
  if (new Date() > record.expiresAt) throw new Error("VERIFICATION_TOKEN_EXPIRED");

  // Mark token used and activate user account atomically — prevents partial failure
  // where the token is consumed but the account remains inactive (or vice-versa).
  await emailVerifRepo.consumeTokenAndActivateUser(tokenHash, record.userId);

  return buildAuthResult(record.userId);
}

export async function resendVerification(email: string): Promise<void> {
  const user = await authRepo.findUserByEmail(email);
  if (!user) return;

  if (user.emailVerifiedAt !== null) throw new Error("ALREADY_VERIFIED");

  await emailVerifRepo.invalidateUserTokens(user.id);

  const rawToken = tokenSvc.generateVerificationToken();
  const tokenHash = tokenSvc.hashVerificationToken(rawToken);
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  await emailVerifRepo.createToken(user.id, tokenHash, expiresAt);
  await emailSvc.sendVerificationEmail(user.email, user.fullName, rawToken);
}

export async function logout(userId: number, refreshTokenHash: string): Promise<void> {
  await authRepo.revokeRefreshToken(refreshTokenHash);
}

export async function refresh(rawRefreshToken: string): Promise<AuthResult> {
  const tokenHash = tokenSvc.hashRefreshToken(rawRefreshToken);
  const stored = await authRepo.findRefreshToken(tokenHash);

  if (!stored) throw new Error("INVALID_REFRESH_TOKEN");

  // stored.expiresAt is already a Date from Prisma — compare directly.
  if (new Date() > stored.expiresAt) {
    await authRepo.revokeRefreshToken(tokenHash);
    throw new Error("REFRESH_TOKEN_EXPIRED");
  }

  // Validate the user is still active and verified before issuing new tokens.
  const user = await authRepo.findUserById(stored.userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  if (!user.emailVerifiedAt) throw new Error("EMAIL_NOT_VERIFIED");
  if (!user.isActive) throw new Error("ACCOUNT_DISABLED");

  await authRepo.revokeRefreshToken(tokenHash);
  return buildAuthResult(stored.userId);
}

export async function getMe(userId: number): Promise<AuthenticatedUser> {
  const user = await authRepo.findUserById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const [roles, permissions] = await Promise.all([
    authRepo.getUserRoles(userId),
    authRepo.getUserPermissions(userId),
  ]);

  return { id: user.id, name: user.fullName, email: user.email, roles, permissions };
}

export async function updateMe(userId: number, input: UpdateMeInput): Promise<AuthenticatedUser> {
  if (input.email) {
    const conflict = await authRepo.findUserByEmailExcluding(input.email, userId);
    if (conflict) throw new Error("EMAIL_TAKEN");
  }

  await authRepo.updateUserProfile(userId, {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.email !== undefined && { email: input.email }),
  });
  return getMe(userId);
}

export async function changePassword(userId: number, input: ChangePasswordInput): Promise<void> {
  const user = await authRepo.findUserById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const valid = await comparePassword(input.current_password, user.passwordHash);
  if (!valid) throw new Error("WRONG_PASSWORD");

  const newHash = await hashPassword(input.new_password);
  await authRepo.updateUserPassword(userId, newHash);
}

async function buildAuthResult(userId: number): Promise<AuthResult> {
  const user = await authRepo.findUserById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const [roles, permissions] = await Promise.all([
    authRepo.getUserRoles(userId),
    authRepo.getUserPermissions(userId),
  ]);

  const authenticatedUser: AuthenticatedUser = {
    id: user.id,
    name: user.fullName,
    email: user.email,
    roles,
    permissions,
  };

  const accessToken = tokenSvc.signAccessToken({
    userId: user.id,
    email: user.email,
    roles,
    permissions,
  });

  const rawRefresh = tokenSvc.generateRefreshToken();
  const refreshHash = tokenSvc.hashRefreshToken(rawRefresh);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await authRepo.saveRefreshToken(userId, refreshHash, expiresAt);

  return { user: authenticatedUser, accessToken, refreshToken: rawRefresh };
}
