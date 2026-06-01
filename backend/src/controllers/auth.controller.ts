import { asyncHandler } from "../lib/async-handler.js";
import { sendCreated, sendError, sendSuccess } from "../lib/http-response.js";
import * as authService from "../services/auth.service.js";
import { clearAuthCookies, hashRefreshToken, setAuthCookies } from "../services/token.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.locals.loggedInUserId = result.user.id;

  sendCreated(res, result.user);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.locals.loggedInUserId = result.user.id;

  sendSuccess(res, result.user);
});

export const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies["refresh_token"] as string | undefined;
  if (rawToken && req.user) {
    await authService.logout(req.user.id, hashRefreshToken(rawToken));
  }
  clearAuthCookies(res);

  sendSuccess(res, null);
});

export const refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies["refresh_token"] as string | undefined;
  if (!rawToken) return sendError(res, 401, "No refresh token provided");

  const result = await authService.refresh(rawToken);
  setAuthCookies(res, result.accessToken, result.refreshToken);

  sendSuccess(res, result.user);
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, user);
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await authService.updateMe(req.user!.id, req.body);
  sendSuccess(res, user);
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user!.id, req.body);
  sendSuccess(res, null, 200, "Password updated successfully.");
});
