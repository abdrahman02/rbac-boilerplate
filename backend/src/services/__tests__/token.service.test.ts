import { describe, expect, it } from "vitest";
import {
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
  verifyAccessToken,
  generateVerificationToken,
  hashVerificationToken,
} from "../token.service.js";

describe("TokenService", () => {
  const payload = {
    userId: 1,
    email: "test@example.com",
    roles: ["user"],
    permissions: ["users:read"],
  };

  it("signs and verifies access token", () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(1);
    expect(decoded.email).toBe("test@example.com");
    expect(decoded.permissions).toContain("users:read");
  });

  it("throws on invalid token", () => {
    expect(() => verifyAccessToken("invalid.token.value")).toThrow();
  });

  it("throws on tampered token", () => {
    const token = signAccessToken(payload);
    const tampered = token.slice(0, -4) + "xxxx";
    expect(() => verifyAccessToken(tampered)).toThrow();
  });

  it("generates unique refresh tokens", () => {
    const t1 = generateRefreshToken();
    const t2 = generateRefreshToken();
    expect(t1).not.toBe(t2);
    expect(t1).toHaveLength(80);
  });

  it("hashes refresh token deterministically", () => {
    const raw = "test-raw-token-value";
    const h1 = hashRefreshToken(raw);
    const h2 = hashRefreshToken(raw);
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(64);
  });

  it("different raw tokens produce different hashes", () => {
    expect(hashRefreshToken("token-a")).not.toBe(hashRefreshToken("token-b"));
  });
});

describe("VerificationToken", () => {
  it("generates unique verification tokens of 80 chars", () => {
    const t1 = generateVerificationToken();
    const t2 = generateVerificationToken();
    expect(t1).not.toBe(t2);
    expect(t1).toHaveLength(80);
  });

  it("hashes verification token deterministically", () => {
    const raw = "test-verification-token";
    expect(hashVerificationToken(raw)).toBe(hashVerificationToken(raw));
    expect(hashVerificationToken(raw)).toHaveLength(64);
  });

  it("different raw tokens produce different hashes", () => {
    expect(hashVerificationToken("token-a")).not.toBe(hashVerificationToken("token-b"));
  });
});
