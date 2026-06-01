import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

const handleErrorMock = vi.fn();
vi.mock("../handle-error.js", () => ({
  handleError: (res: Response, error: unknown) => handleErrorMock(res, error),
}));

const { asyncHandler } = await import("../async-handler.js");

describe("asyncHandler", () => {
  it("invokes the wrapped controller with req and res", async () => {
    const controller = vi.fn().mockResolvedValue(undefined);
    const req = {} as Request;
    const res = {} as Response;

    await asyncHandler(controller)(req, res, (() => {}) as NextFunction);

    expect(controller).toHaveBeenCalledWith(req, res);
  });

  it("delegates thrown errors to handleError instead of propagating", async () => {
    handleErrorMock.mockClear();
    const error = new Error("BOOM");
    const controller = vi.fn().mockRejectedValue(error);
    const res = {} as Response;

    await expect(asyncHandler(controller)({} as Request, res, (() => {}) as NextFunction)).resolves.toBeUndefined();

    expect(handleErrorMock).toHaveBeenCalledWith(res, error);
  });
});
