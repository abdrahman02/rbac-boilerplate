import type { Response } from "express";
import type { ApiResponse } from "../types/index.js";

const ERROR_MAP: Record<string, { status: number; message: string }> = {
  INVALID_CREDENTIALS: { status: 401, message: "Invalid email or password." },
  ACCOUNT_DISABLED: { status: 403, message: "Your account has been disabled. Contact support." },
  INVALID_REFRESH_TOKEN: { status: 401, message: "Your session has expired. Please log in again." },
  REFRESH_TOKEN_EXPIRED: { status: 401, message: "Your session has expired. Please log in again." },
  EMAIL_TAKEN: { status: 409, message: "Email address is already in use." },
  USER_NOT_FOUND: { status: 404, message: "User not found." },
  WRONG_PASSWORD: { status: 400, message: "Current password is incorrect." },
  ROLE_NOT_FOUND: { status: 404, message: "Role not found." },
  ROLE_NAME_TAKEN: { status: 409, message: "A role with this name already exists." },
  PERMISSION_NAME_TAKEN: { status: 409, message: "A permission with this name already exists." },
  EMAIL_NOT_VERIFIED: { status: 403, message: "Please verify your email address before logging in." },
  INVALID_VERIFICATION_TOKEN: { status: 400, message: "This verification link is invalid or has already been used." },
  VERIFICATION_TOKEN_EXPIRED: { status: 400, message: "This verification link has expired. Please request a new one." },
  ALREADY_VERIFIED: { status: 400, message: "Your email address is already verified." },
  INVALID_RESET_TOKEN: { status: 400, message: "This reset link is invalid or has already been used." },
  RESET_TOKEN_EXPIRED: { status: 400, message: "This reset link has expired. Please request a new one." },
};

export function handleError(res: Response, err: unknown): void {
  const code = err instanceof Error ? err.message : "";
  const mapped = ERROR_MAP[code];

  const status = mapped?.status ?? 500;
  const message = mapped?.message ?? "An unexpected error occurred. Please try again.";

  const body: ApiResponse<null> = { success: false, data: null, message };
  res.status(status).json(body);
}
