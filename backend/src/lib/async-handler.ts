import type { NextFunction, Request, Response } from "express";
import { handleError } from "./handle-error.js";

type AsyncController = (req: Request, res: Response) => Promise<void>;

/**
 * Wraps an async controller so any thrown error is funnelled through the
 * central `handleError`, removing the repeated try/catch in every handler.
 */
export function asyncHandler(controller: AsyncController) {
  return async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      await controller(req, res);
    } catch (error) {
      handleError(res, error);
    }
  };
}
