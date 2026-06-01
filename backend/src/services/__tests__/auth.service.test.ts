import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../repositories/auth.repository.js", () => ({
  findUserByEmail: vi.fn(),
  findUserByEmailExcluding: vi.fn(),
  findUserById: vi.fn(),
  getUserRoles: vi.fn(),
  getUserPermissions: vi.fn(),
  updateUserProfile: vi.fn(),
  updateUserPassword: vi.fn(),
  createUser: vi.fn(),
  assignDefaultRole: vi.fn(),
  saveRefreshToken: vi.fn(),
  findRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn(),
}));

vi.mock("../../repositories/email-verification.repository.js", () => ({
  createToken: vi.fn(),
  findByTokenHash: vi.fn(),
  invalidateUserTokens: vi.fn(),
  consumeTokenAndActivateUser: vi.fn(),
}));

vi.mock("../../repositories/password-reset.repository.js", () => ({
  createToken: vi.fn(),
  findByTokenHash: vi.fn(),
  invalidateUserTokens: vi.fn(),
  consumeTokenAndResetPassword: vi.fn(),
}));

vi.mock("../../services/email.service.js", () => ({
  sendVerificationEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("../../utils/hash.js", () => ({
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
}));

import type { EmailVerificationToken, User } from "../../generated/prisma/index.js";
import * as repo from "../../repositories/auth.repository.js";
import * as emailVerifRepo from "../../repositories/email-verification.repository.js";
import * as passwordResetRepo from "../../repositories/password-reset.repository.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../services/email.service.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import {
  changePassword,
  forgotPassword,
  login,
  refresh,
  register,
  resendVerification,
  resetPassword,
  updateMe,
  verifyEmail,
} from "../auth.service.js";

const MOCK_USER = {
  id: 1,
  fullName: "Alice",
  email: "alice@example.com",
  passwordHash: "hashed",
  isActive: true,
  emailVerifiedAt: new Date(),
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
} as User;

// Unverified users have isActive=false because accounts are inactive until email verification.
const MOCK_UNVERIFIED_USER = { ...MOCK_USER, emailVerifiedAt: null, isActive: false } as User;

const MOCK_TOKEN: EmailVerificationToken = {
  id: 1,
  userId: 1,
  tokenHash: "hashvalue",
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  usedAt: null,
  createdAt: new Date(),
};

// ── register ────────────────────────────────────────────────────────
describe("register", () => {
  beforeEach(() => vi.resetAllMocks());

  it("creates user, sends verification email, returns user data without tokens", async () => {
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(null);
    vi.mocked(hashPassword).mockResolvedValueOnce("hashed");
    vi.mocked(repo.createUser).mockResolvedValueOnce(1);
    vi.mocked(repo.assignDefaultRole).mockResolvedValueOnce(undefined);
    vi.mocked(emailVerifRepo.createToken).mockResolvedValueOnce(undefined);
    vi.mocked(sendVerificationEmail).mockResolvedValueOnce(undefined);

    const result = await register({ name: "Alice", email: "alice@example.com", password: "Pass123!" });

    expect(sendVerificationEmail).toHaveBeenCalledWith("alice@example.com", "Alice", expect.any(String));
    expect(result).toEqual({ id: 1, name: "Alice", email: "alice@example.com" });
  });

  it("throws EMAIL_TAKEN when email already exists", async () => {
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(MOCK_USER);

    await expect(register({ name: "Bob", email: "alice@example.com", password: "Pass123!" })).rejects.toThrow(
      "EMAIL_TAKEN",
    );
    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });
});

// ── login ────────────────────────────────────────────────────────
describe("login", () => {
  beforeEach(() => vi.resetAllMocks());

  it("throws EMAIL_NOT_VERIFIED when emailVerifiedAt is null", async () => {
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(MOCK_UNVERIFIED_USER);
    vi.mocked(comparePassword).mockResolvedValueOnce(true);

    await expect(login({ email: "alice@example.com", password: "Pass123!" })).rejects.toThrow("EMAIL_NOT_VERIFIED");
  });

  it("throws INVALID_CREDENTIALS for wrong password", async () => {
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(MOCK_USER);
    vi.mocked(comparePassword).mockResolvedValueOnce(false);

    await expect(login({ email: "alice@example.com", password: "wrong" })).rejects.toThrow("INVALID_CREDENTIALS");
  });

  it("throws ACCOUNT_DISABLED for verified user disabled by admin", async () => {
    // MOCK_USER has emailVerifiedAt set, so isActive=false here means admin-disabled.
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce({ ...MOCK_USER, isActive: false } as User);
    vi.mocked(comparePassword).mockResolvedValueOnce(true);

    await expect(login({ email: "alice@example.com", password: "Pass123!" })).rejects.toThrow("ACCOUNT_DISABLED");
  });

  it("throws EMAIL_NOT_VERIFIED (not ACCOUNT_DISABLED) for unverified user", async () => {
    // Unverified users have isActive=false by design, but the error should be EMAIL_NOT_VERIFIED
    // so users know to check their inbox — not a vague ACCOUNT_DISABLED.
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(MOCK_UNVERIFIED_USER);
    vi.mocked(comparePassword).mockResolvedValueOnce(true);

    await expect(login({ email: "alice@example.com", password: "Pass123!" })).rejects.toThrow("EMAIL_NOT_VERIFIED");
  });
});

// ── verifyEmail ────────────────────────────────────────────────────────
describe("verifyEmail", () => {
  beforeEach(() => vi.resetAllMocks());

  it("atomically consumes token and activates user, returns auth result with tokens", async () => {
    vi.mocked(emailVerifRepo.findByTokenHash).mockResolvedValueOnce(MOCK_TOKEN);
    vi.mocked(emailVerifRepo.consumeTokenAndActivateUser).mockResolvedValueOnce(undefined);
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_USER);
    vi.mocked(repo.getUserRoles).mockResolvedValueOnce(["user"]);
    vi.mocked(repo.getUserPermissions).mockResolvedValueOnce([]);
    vi.mocked(repo.saveRefreshToken).mockResolvedValueOnce(undefined);

    const result = await verifyEmail("rawtoken");

    // consumeTokenAndActivateUser handles both markTokenUsed + setEmailVerified atomically.
    expect(emailVerifRepo.consumeTokenAndActivateUser).toHaveBeenCalledWith(expect.any(String), 1);
    expect(result.user.email).toBe("alice@example.com");
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it("throws INVALID_VERIFICATION_TOKEN when token not found", async () => {
    vi.mocked(emailVerifRepo.findByTokenHash).mockResolvedValueOnce(null);

    await expect(verifyEmail("badtoken")).rejects.toThrow("INVALID_VERIFICATION_TOKEN");
  });

  it("throws INVALID_VERIFICATION_TOKEN when token already used", async () => {
    vi.mocked(emailVerifRepo.findByTokenHash).mockResolvedValueOnce({ ...MOCK_TOKEN, usedAt: new Date() });

    await expect(verifyEmail("usedtoken")).rejects.toThrow("INVALID_VERIFICATION_TOKEN");
  });

  it("throws VERIFICATION_TOKEN_EXPIRED when token is past expiry", async () => {
    vi.mocked(emailVerifRepo.findByTokenHash).mockResolvedValueOnce({
      ...MOCK_TOKEN,
      expiresAt: new Date(Date.now() - 1000),
    });

    await expect(verifyEmail("expiredtoken")).rejects.toThrow("VERIFICATION_TOKEN_EXPIRED");
  });
});

// ── refresh ────────────────────────────────────────────────────────
describe("refresh", () => {
  beforeEach(() => vi.resetAllMocks());

  const MOCK_STORED_TOKEN = {
    id: 10,
    userId: 1,
    tokenHash: "hashvalue",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    revokedAt: null,
  };

  it("revokes old token, returns new auth result for active verified user", async () => {
    vi.mocked(repo.findRefreshToken).mockResolvedValueOnce(MOCK_STORED_TOKEN);
    // findUserById is called twice: once in refresh() for validation, once in buildAuthResult().
    vi.mocked(repo.findUserById).mockResolvedValue(MOCK_USER);
    vi.mocked(repo.getUserRoles).mockResolvedValueOnce(["user"]);
    vi.mocked(repo.getUserPermissions).mockResolvedValueOnce([]);
    vi.mocked(repo.revokeRefreshToken).mockResolvedValueOnce(undefined);
    vi.mocked(repo.saveRefreshToken).mockResolvedValueOnce(undefined);

    const result = await refresh("rawtoken");

    expect(repo.revokeRefreshToken).toHaveBeenCalled();
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it("throws INVALID_REFRESH_TOKEN when token not found", async () => {
    vi.mocked(repo.findRefreshToken).mockResolvedValueOnce(null);

    await expect(refresh("badtoken")).rejects.toThrow("INVALID_REFRESH_TOKEN");
  });

  it("throws REFRESH_TOKEN_EXPIRED and revokes token when past expiry", async () => {
    vi.mocked(repo.findRefreshToken).mockResolvedValueOnce({
      ...MOCK_STORED_TOKEN,
      expiresAt: new Date(Date.now() - 1000),
    });
    vi.mocked(repo.revokeRefreshToken).mockResolvedValueOnce(undefined);

    await expect(refresh("expiredtoken")).rejects.toThrow("REFRESH_TOKEN_EXPIRED");
    expect(repo.revokeRefreshToken).toHaveBeenCalled();
  });

  it("throws ACCOUNT_DISABLED when user is deactivated after token was issued", async () => {
    vi.mocked(repo.findRefreshToken).mockResolvedValueOnce(MOCK_STORED_TOKEN);
    vi.mocked(repo.findUserById).mockResolvedValueOnce({ ...MOCK_USER, isActive: false } as User);

    await expect(refresh("rawtoken")).rejects.toThrow("ACCOUNT_DISABLED");
  });

  it("throws EMAIL_NOT_VERIFIED when user has no verified email", async () => {
    vi.mocked(repo.findRefreshToken).mockResolvedValueOnce(MOCK_STORED_TOKEN);
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_UNVERIFIED_USER);

    await expect(refresh("rawtoken")).rejects.toThrow("EMAIL_NOT_VERIFIED");
  });
});

// ── resendVerification ────────────────────────────────────────────────────────
describe("resendVerification", () => {
  beforeEach(() => vi.resetAllMocks());

  it("invalidates old tokens, creates new one, sends email", async () => {
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(MOCK_UNVERIFIED_USER);
    vi.mocked(emailVerifRepo.invalidateUserTokens).mockResolvedValueOnce(undefined);
    vi.mocked(emailVerifRepo.createToken).mockResolvedValueOnce(undefined);
    vi.mocked(sendVerificationEmail).mockResolvedValueOnce(undefined);

    await resendVerification("alice@example.com");

    expect(emailVerifRepo.invalidateUserTokens).toHaveBeenCalledWith(1);
    expect(emailVerifRepo.createToken).toHaveBeenCalledWith(1, expect.any(String), expect.any(Date));
    expect(sendVerificationEmail).toHaveBeenCalledWith("alice@example.com", "Alice", expect.any(String));
  });

  it("returns silently when email not found (prevent user enumeration)", async () => {
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(null);

    await expect(resendVerification("unknown@example.com")).resolves.toBeUndefined();
    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });

  it("throws ALREADY_VERIFIED when user is already verified", async () => {
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(MOCK_USER);

    await expect(resendVerification("alice@example.com")).rejects.toThrow("ALREADY_VERIFIED");
    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });
});

// ── updateMe (existing — kept intact) ────────────────────────────────────────────────────────
describe("updateMe", () => {
  beforeEach(() => vi.resetAllMocks());

  it("updates name and returns authenticated user", async () => {
    vi.mocked(repo.findUserByEmailExcluding).mockResolvedValueOnce(null);
    vi.mocked(repo.updateUserProfile).mockResolvedValueOnce(undefined);
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_USER);
    vi.mocked(repo.getUserRoles).mockResolvedValueOnce(["admin"]);
    vi.mocked(repo.getUserPermissions).mockResolvedValueOnce(["users:read"]);

    const result = await updateMe(1, { name: "New Name" });

    expect(repo.updateUserProfile).toHaveBeenCalledWith(1, { name: "New Name", email: undefined });
    expect(result.name).toBe("Alice");
  });

  it("throws EMAIL_TAKEN when new email is already used by another user", async () => {
    vi.mocked(repo.findUserByEmailExcluding).mockResolvedValueOnce({ id: 2 } as User);

    await expect(updateMe(1, { email: "taken@example.com" })).rejects.toThrow("EMAIL_TAKEN");
    expect(repo.updateUserProfile).not.toHaveBeenCalled();
  });

  it("skips email uniqueness check when email is not provided", async () => {
    vi.mocked(repo.updateUserProfile).mockResolvedValueOnce(undefined);
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_USER);
    vi.mocked(repo.getUserRoles).mockResolvedValueOnce([]);
    vi.mocked(repo.getUserPermissions).mockResolvedValueOnce([]);

    await updateMe(1, { name: "Only Name" });

    expect(repo.findUserByEmailExcluding).not.toHaveBeenCalled();
  });
});

// ── changePassword (existing — kept intact) ────────────────────────────────────────────────────────
describe("changePassword", () => {
  beforeEach(() => vi.resetAllMocks());

  it("changes password when current password is correct", async () => {
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_USER);
    vi.mocked(comparePassword).mockResolvedValueOnce(true);
    vi.mocked(hashPassword).mockResolvedValueOnce("newhash");
    vi.mocked(repo.updateUserPassword).mockResolvedValueOnce(undefined);

    await expect(changePassword(1, { current_password: "Old1234!", new_password: "New1234!" })).resolves.not.toThrow();
    expect(repo.updateUserPassword).toHaveBeenCalledWith(1, "newhash");
  });

  it("throws WRONG_PASSWORD when current password is incorrect", async () => {
    vi.mocked(repo.findUserById).mockResolvedValueOnce(MOCK_USER);
    vi.mocked(comparePassword).mockResolvedValueOnce(false);

    await expect(changePassword(1, { current_password: "wrong", new_password: "New1234!" })).rejects.toThrow(
      "WRONG_PASSWORD",
    );
    expect(repo.updateUserPassword).not.toHaveBeenCalled();
  });

  it("throws USER_NOT_FOUND when user does not exist", async () => {
    vi.mocked(repo.findUserById).mockResolvedValueOnce(null);

    await expect(changePassword(999, { current_password: "any", new_password: "New1234!" })).rejects.toThrow(
      "USER_NOT_FOUND",
    );
  });
});

// ── forgotPassword ────────────────────────────────────────────────────────
describe("forgotPassword", () => {
  beforeEach(() => vi.resetAllMocks());

  it("invalidates old tokens, creates new token, sends reset email", async () => {
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(MOCK_UNVERIFIED_USER);
    vi.mocked(passwordResetRepo.invalidateUserTokens).mockResolvedValueOnce(undefined);
    vi.mocked(passwordResetRepo.createToken).mockResolvedValueOnce(undefined);
    vi.mocked(sendPasswordResetEmail).mockResolvedValueOnce(undefined);

    await forgotPassword("alice@example.com");

    expect(passwordResetRepo.invalidateUserTokens).toHaveBeenCalledWith(1);
    expect(passwordResetRepo.createToken).toHaveBeenCalledWith(1, expect.any(String), expect.any(Date));
  });

  it("returns silently when email not found (prevent user enumeration)", async () => {
    vi.mocked(repo.findUserByEmail).mockResolvedValueOnce(null);

    await expect(forgotPassword("unknown@example.com")).resolves.toBeUndefined();
    expect(passwordResetRepo.createToken).not.toHaveBeenCalled();
  });
});

// ── resetPassword ────────────────────────────────────────────────────────
describe("resetPassword", () => {
  beforeEach(() => vi.resetAllMocks());

  const MOCK_RESET_TOKEN = {
    id: 1,
    userId: 1,
    tokenHash: "hashvalue",
    isInvite: false,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    usedAt: null,
    createdAt: new Date(),
  };

  it("consumes token and resets password atomically", async () => {
    vi.mocked(passwordResetRepo.findByTokenHash).mockResolvedValueOnce(MOCK_RESET_TOKEN);
    vi.mocked(passwordResetRepo.consumeTokenAndResetPassword).mockResolvedValueOnce(undefined);
    vi.mocked(hashPassword).mockResolvedValueOnce("newhash");

    await resetPassword("rawtoken", "NewPassword1!");

    expect(passwordResetRepo.consumeTokenAndResetPassword).toHaveBeenCalledWith(
      expect.any(String),
      1,
      expect.any(String),
    );
  });

  it("throws INVALID_RESET_TOKEN when token not found", async () => {
    vi.mocked(passwordResetRepo.findByTokenHash).mockResolvedValueOnce(null);

    await expect(resetPassword("badtoken", "NewPassword1!")).rejects.toThrow("INVALID_RESET_TOKEN");
  });

  it("throws INVALID_RESET_TOKEN when token already used", async () => {
    vi.mocked(passwordResetRepo.findByTokenHash).mockResolvedValueOnce({
      ...MOCK_RESET_TOKEN,
      usedAt: new Date(),
    });

    await expect(resetPassword("usedtoken", "NewPassword1!")).rejects.toThrow("INVALID_RESET_TOKEN");
  });

  it("throws RESET_TOKEN_EXPIRED when token is past expiry", async () => {
    vi.mocked(passwordResetRepo.findByTokenHash).mockResolvedValueOnce({
      ...MOCK_RESET_TOKEN,
      expiresAt: new Date(Date.now() - 1000),
    });

    await expect(resetPassword("expiredtoken", "NewPassword1!")).rejects.toThrow("RESET_TOKEN_EXPIRED");
  });
});
