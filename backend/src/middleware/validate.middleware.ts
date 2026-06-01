import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import type { ApiResponse } from "../types/index.js";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      const body: ApiResponse<null> = {
        success: false,
        data: null,
        message: firstError?.message ?? "Validation failed",
      };
      res.status(422).json(body);
      return;
    }

    req.body = result.data;
    next();
  };
}
