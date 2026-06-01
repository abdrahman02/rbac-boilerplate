import { createHash, randomBytes } from "node:crypto";
import type { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AccessTokenPayload {
  userId: number;
  email: string;
  roles: string[];
  permissions: string[];
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as string | number,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  return decoded as AccessTokenPayload;
}

export function generateRefreshToken(): string {
  return randomBytes(40).toString("hex");
}

export function hashRefreshToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

const COOKIE_BASE = {
  httpOnly: true,
  sameSite: "strict" as const,
} as const;

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  const secure = env.NODE_ENV === "production";

  res.cookie("access_token", accessToken, {
    ...COOKIE_BASE,
    secure,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    ...COOKIE_BASE,
    secure,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token", { path: "/api/auth/refresh" });
}

export function generateVerificationToken(): string {
  return randomBytes(40).toString("hex");
}

export function hashVerificationToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
