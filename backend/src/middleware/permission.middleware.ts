import type { NextFunction, Request, Response } from "express";
import type { ApiResponse } from "../types/index.js";

export function requirePermission(permission: string | string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: "Unauthorized",
      };
      res.status(401).json(body);
      return;
    }

    const required = Array.isArray(permission) ? permission : [permission];
    const hasPermission = required.some((p) => req.user!.permissions.includes(p));

    if (!hasPermission) {
      const label = required.join("' or '");
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: `Forbidden: requires '${label}'`,
      };
      res.status(403).json(body);
      return;
    }

    next();
  };
}
