import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/token.service.js";
import type { ApiResponse } from "../types/index.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies["access_token"] as string | undefined;

  if (!token) {
    const body: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Unauthorized",
    };
    res.status(401).json(body);
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      name: "",
      roles: payload.roles,
      permissions: payload.permissions,
    };
    next();
  } catch {
    const body: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Token expired or invalid",
    };
    res.status(401).json(body);
  }
}
